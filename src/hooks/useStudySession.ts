import { useCallback, useMemo, useState } from 'react'
import type {
  ActiveSession,
  EvaluationResult,
  Question,
  QuestionStats,
  SessionAnswerRecord,
  SessionMode,
  UiCategory,
} from '../types/question'
import { evaluateAnswer } from '../services/answerEvaluator'
import { summarizeSession } from '../services/progress'
import {
  applyOutcome,
  buildSessionQueue,
  emptyStats,
  scheduleResurface,
} from '../services/questionScheduler'
import { useStudy } from './useStudyStore'

function newId() {
  return `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

export type StartSessionInput = {
  mode: SessionMode
  size?: number | null
  category?: UiCategory | 'All'
  topic?: string
}

export function useStudySession(questions: Question[]) {
  const {
    store,
    setActiveSession,
    setQuestionStats,
    markStudiedToday,
    completeSession,
    settings,
  } = useStudy()

  const questionsById = useMemo(() => new Map(questions.map((q) => [q.id, q])), [questions])
  const [summary, setSummary] = useState<ReturnType<typeof summarizeSession> | null>(null)
  const [draftAnswer, setDraftAnswer] = useState('')
  const [phase, setPhase] = useState<'prompt' | 'result'>('prompt')
  const [lastEvaluation, setLastEvaluation] = useState<EvaluationResult | 'revealed' | null>(null)
  const [statsSnapshot, setStatsSnapshot] = useState<Record<string, QuestionStats>>({})

  const session = store.activeSession

  const currentQuestion = useMemo(() => {
    if (!session) return undefined
    const id = session.questionIds[session.currentIndex]
    return id ? questionsById.get(id) : undefined
  }, [session, questionsById])

  const startSession = useCallback(
    (input: StartSessionInput) => {
      const size =
        input.size === null
          ? null
          : (input.size ??
            (input.mode === 'quick20'
              ? 20
              : input.mode === 'quick50'
                ? 50
                : input.mode === 'endless'
                  ? null
                  : settings.defaultSessionSize))

      const modeSize =
        input.mode === 'quick10'
          ? 10
          : input.mode === 'quick20'
            ? 20
            : input.mode === 'quick50'
              ? 50
              : size

      const queue = buildSessionQueue(questions, {
        mode: input.mode,
        size: modeSize,
        category: input.category ?? 'All',
        topic: input.topic,
        stats: store.questionStats,
      })

      const now = new Date()
      const active: ActiveSession = {
        id: newId(),
        mode: input.mode,
        questionIds: queue,
        currentIndex: 0,
        results: [],
        categoryFilter: input.category,
        topicFilter: input.topic,
        startedAt: now.toISOString(),
        expiresAt: new Date(now.getTime() + 24 * 3600 * 1000).toISOString(),
        size: modeSize,
      }
      setStatsSnapshot({ ...store.questionStats })
      setSummary(null)
      setDraftAnswer('')
      setPhase('prompt')
      setLastEvaluation(null)
      setActiveSession(active)
    },
    [questions, settings.defaultSessionSize, store.questionStats, setActiveSession],
  )

  const resumeIfValid = useCallback(() => {
    const active = store.activeSession
    if (!active) return false
    if (Date.parse(active.expiresAt) < Date.now()) {
      setActiveSession(null)
      return false
    }
    setPhase(active.results.length > active.currentIndex ? 'result' : 'prompt')
    return true
  }, [store.activeSession, setActiveSession])

  const recordResult = useCallback(
    (
      evaluation: SessionAnswerRecord['evaluation'],
      opts: { userAnswer?: string; needPractice?: boolean; selfGrade?: 'correct' | 'incorrect' | 'unsure' } = {},
    ) => {
      if (!session || !currentQuestion) return

      let outcome: 'correct' | 'incorrect' | 'unsure' = 'incorrect'
      if (evaluation === 'correct' || evaluation === 'knew') outcome = 'correct'
      else if (evaluation === 'unsure') outcome = 'unsure'

      const prev = store.questionStats[currentQuestion.id] ?? emptyStats()
      let nextStats = applyOutcome(prev, outcome)
      if (opts.needPractice) nextStats = { ...nextStats, needsPractice: true }
      setQuestionStats(currentQuestion.id, nextStats)
      markStudiedToday()

      const record: SessionAnswerRecord = {
        questionId: currentQuestion.id,
        evaluation,
        userAnswer: opts.userAnswer,
        selfGrade: opts.selfGrade,
        markedNeedPractice: opts.needPractice,
        answeredAt: new Date().toISOString(),
      }

      let questionIds = [...session.questionIds]
      const remaining = questionIds.slice(session.currentIndex + 1)
      if (outcome === 'incorrect' || outcome === 'unsure') {
        const resurfaced = scheduleResurface(remaining, currentQuestion.id)
        questionIds = [...questionIds.slice(0, session.currentIndex + 1), ...resurfaced]
        if (session.size == null) {
          // endless — ok
        } else if (questionIds.length > session.size + 8) {
          questionIds = questionIds.slice(0, session.size + 8)
        }
      }

      const updated: ActiveSession = {
        ...session,
        questionIds,
        results: [...session.results, record],
      }
      setActiveSession(updated)
      setLastEvaluation(
        evaluation === 'knew'
          ? 'correct'
          : evaluation === 'wrong' || evaluation === 'unsure'
            ? evaluation === 'unsure'
              ? 'close'
              : 'incorrect'
            : (evaluation as EvaluationResult | 'revealed'),
      )
      setPhase('result')
    },
    [
      session,
      currentQuestion,
      store.questionStats,
      setQuestionStats,
      markStudiedToday,
      setActiveSession,
    ],
  )

  const submitTyped = useCallback(() => {
    if (!currentQuestion) return
    if (currentQuestion.gradeMode === 'self') {
      recordResult('revealed', { userAnswer: draftAnswer })
      return
    }
    const result = evaluateAnswer(draftAnswer, currentQuestion)
    recordResult(result, { userAnswer: draftAnswer })
  }, [currentQuestion, draftAnswer, recordResult])

  const reveal = useCallback(() => {
    recordResult('revealed', { userAnswer: draftAnswer })
  }, [recordResult, draftAnswer])

  const selfGrade = useCallback(
    (grade: 'correct' | 'incorrect' | 'unsure') => {
      if (!session || !currentQuestion) return
      // Adjust last result if we already revealed
      const outcome = grade === 'correct' ? 'knew' : grade === 'unsure' ? 'unsure' : 'wrong'
      const prev = store.questionStats[currentQuestion.id] ?? emptyStats()
      // Undo-ish: re-apply from empty-ish by using applyOutcome again from previous attempts-1 is hard;
      // For simplicity apply additional delta:
      const mapped = grade === 'correct' ? 'correct' : grade === 'unsure' ? 'unsure' : 'incorrect'
      const nextStats = applyOutcome(
        {
          ...prev,
          attempts: Math.max(0, prev.attempts - 1),
          correct: Math.max(0, prev.correct - (prev.streak > 0 ? 0 : 0)),
        },
        mapped,
      )
      setQuestionStats(currentQuestion.id, nextStats)

      const results = [...session.results]
      const last = results[results.length - 1]
      if (last && last.questionId === currentQuestion.id) {
        results[results.length - 1] = {
          ...last,
          evaluation: outcome,
          selfGrade: grade,
        }
      }
      setActiveSession({ ...session, results })
      setLastEvaluation(grade === 'correct' ? 'correct' : grade === 'unsure' ? 'close' : 'incorrect')
    },
    [session, currentQuestion, store.questionStats, setQuestionStats, setActiveSession],
  )

  const markNeedPractice = useCallback(() => {
    if (!currentQuestion) return
    const prev = store.questionStats[currentQuestion.id] ?? emptyStats()
    setQuestionStats(currentQuestion.id, { ...prev, needsPractice: true })
    if (session) {
      const results = [...session.results]
      const last = results[results.length - 1]
      if (last) results[results.length - 1] = { ...last, markedNeedPractice: true }
      setActiveSession({ ...session, results })
    }
  }, [currentQuestion, store.questionStats, setQuestionStats, session, setActiveSession])

  const markGotIt = useCallback(() => {
    if (!currentQuestion) return
    const prev = store.questionStats[currentQuestion.id] ?? emptyStats()
    if (prev.needsPractice) {
      setQuestionStats(currentQuestion.id, { ...prev, needsPractice: false })
    }
  }, [currentQuestion, store.questionStats, setQuestionStats])

  const finishIfDone = useCallback(
    (active: ActiveSession) => {
      const done =
        active.size != null
          ? active.results.length >= active.size || active.currentIndex >= active.questionIds.length - 1 && phase === 'result'
          : false

      // Fixed-length: advance until we've recorded `size` results
      if (active.size != null && active.results.length >= active.size) {
        const s = summarizeSession({
          id: active.id,
          mode: active.mode,
          startedAt: active.startedAt,
          results: active.results,
          questionsById,
          statsBefore: statsSnapshot,
          statsAfter: store.questionStats,
        })
        setSummary(s)
        completeSession(s)
        return true
      }
      void done
      return false
    },
    [questionsById, statsSnapshot, store.questionStats, completeSession, phase],
  )

  const goNext = useCallback(() => {
    if (!session) return
    if (session.size != null && session.results.length >= session.size) {
      finishIfDone(session)
      return
    }
    const nextIndex = session.currentIndex + 1
    if (nextIndex >= session.questionIds.length) {
      // Endless: extend queue
      if (session.size == null) {
        const more = buildSessionQueue(questions, {
          mode: 'mixed',
          size: 10,
          category: (session.categoryFilter as UiCategory | 'All') ?? 'All',
          topic: session.topicFilter,
          stats: store.questionStats,
        }).filter((id) => id !== session.questionIds[session.currentIndex])
        const questionIds = [...session.questionIds, ...more]
        setActiveSession({
          ...session,
          questionIds,
          currentIndex: nextIndex,
        })
        setDraftAnswer('')
        setPhase('prompt')
        setLastEvaluation(null)
        return
      }
      finishIfDone(session)
      return
    }
    setActiveSession({ ...session, currentIndex: nextIndex })
    setDraftAnswer('')
    setPhase('prompt')
    setLastEvaluation(null)
  }, [session, finishIfDone, questions, store.questionStats, setActiveSession])

  const abandon = useCallback(() => {
    setActiveSession(null)
    setSummary(null)
    setPhase('prompt')
  }, [setActiveSession])

  return {
    session,
    currentQuestion,
    draftAnswer,
    setDraftAnswer,
    phase,
    lastEvaluation,
    summary,
    startSession,
    resumeIfValid,
    submitTyped,
    reveal,
    selfGrade,
    markNeedPractice,
    markGotIt,
    goNext,
    abandon,
    evaluateAnswer,
  }
}
