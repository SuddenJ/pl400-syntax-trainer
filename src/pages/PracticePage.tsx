import { useEffect, useMemo, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AnswerCard } from '../components/AnswerCard'
import { SyntaxAutocompleteInput } from '../components/SyntaxAutocompleteInput'
import { Card, PageHeader, PrimaryButton, SecondaryButton } from '../components/ui'
import { ProgressBar } from '../components/ProgressBar'
import { questions } from '../data/questions'
import { useStudySession } from '../hooks/useStudySession'
import { useStudy } from '../hooks/useStudyStore'
import type { SessionMode, UiCategory } from '../types/question'
import { UI_CATEGORIES } from '../utils/categories'

export function PracticePage() {
  const [params] = useSearchParams()
  const {
    session,
    currentQuestion,
    draftAnswer,
    setDraftAnswer,
    phase,
    lastEvaluation,
    summary,
    startSession,
    submitTyped,
    reveal,
    selfGrade,
    markNeedPractice,
    markGotIt,
    goNext,
    abandon,
  } = useStudySession(questions)
  const { settings } = useStudy()
  const startedFromQuery = useRef(false)

  useEffect(() => {
    if (startedFromQuery.current || session || summary) return
    const mode = params.get('mode') as SessionMode | null
    if (!mode) return
    startedFromQuery.current = true
    const category = (params.get('category') as UiCategory | null) ?? 'All'
    startSession({ mode, category: mode === 'category' ? category : 'All' })
  }, [params, session, summary, startSession])

  useEffect(() => {
    if (phase !== 'prompt') return
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      const typing = tag === 'TEXTAREA' || tag === 'INPUT'
      if (e.key === 'Enter' && !e.shiftKey && typing) {
        e.preventDefault()
        submitTyped()
      }
      if (!typing && e.key.toLowerCase() === 'r') {
        e.preventDefault()
        reveal()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, submitTyped, reveal])

  useEffect(() => {
    if (phase !== 'result') return
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'TEXTAREA' || tag === 'INPUT') return
      if (e.key === 'Enter') {
        e.preventDefault()
        markGotIt()
        goNext()
      }
      if (e.key === '1') {
        e.preventDefault()
        markGotIt()
        goNext()
      }
      if (e.key === '2') {
        e.preventDefault()
        markNeedPractice()
        goNext()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, goNext, markGotIt, markNeedPractice])

  const progress = useMemo(() => {
    if (!session) return 0
    const total = session.size ?? Math.max(session.questionIds.length, 1)
    return Math.min(1, session.results.length / total)
  }, [session])

  if (summary) {
    return (
      <div>
        <PageHeader title="Session complete" subtitle="Nice work — keep the syntax sharp." />
        <Card className="mb-4 space-y-2">
          <p className="text-3xl font-semibold">
            {summary.correct} / {summary.total}
          </p>
          <p className="text-sm text-slate-500">
            Accuracy {summary.total ? Math.round((summary.correct / summary.total) * 100) : 0}%
          </p>
          <p className="text-sm">Newly mastered: {summary.newlyMastered}</p>
          <p className="text-sm">Need review: {summary.needReview}</p>
        </Card>
        <Card className="mb-4">
          <h2 className="mb-3 text-sm font-semibold text-slate-500 uppercase">By category</h2>
          <ul className="space-y-3">
            {Object.entries(summary.categoryBreakdown).map(([cat, row]) => (
              <li key={cat}>
                <ProgressBar
                  label={cat}
                  value={row.total ? row.correct / row.total : 0}
                  tone={row.total && row.correct / row.total >= 0.8 ? 'ok' : 'accent'}
                />
              </li>
            ))}
          </ul>
        </Card>
        <div className="grid gap-2">
          <Link to="/mistakes">
            <PrimaryButton>Review Mistakes</PrimaryButton>
          </Link>
          <Link to="/practice?mode=weak">
            <SecondaryButton>Practice Weak Areas</SecondaryButton>
          </Link>
          <SecondaryButton
            onClick={() =>
              startSession({ mode: 'quick10', size: settings.defaultSessionSize })
            }
          >
            Start Another Session
          </SecondaryButton>
        </div>
      </div>
    )
  }

  if (!session || !currentQuestion) {
    return <SessionSetup onStart={startSession} defaultSize={settings.defaultSessionSize} />
  }

  const preferReveal =
    settings.practicePreference === 'reveal' || currentQuestion.gradeMode === 'self'

  return (
    <div>
      <PageHeader
        title="Practice"
        subtitle={`${currentQuestion.id} · ${currentQuestion.topic}`}
        action={
          <button
            type="button"
            className="text-sm text-slate-500 underline"
            onClick={abandon}
          >
            End
          </button>
        }
      />
      <div className="mb-4">
        <ProgressBar
          value={progress}
          label={
            session.size
              ? `${session.results.length} / ${session.size}`
              : `Q ${session.currentIndex + 1}`
          }
        />
      </div>

      <Card className="mb-4">
        <p className="text-base leading-relaxed text-slate-800 dark:text-slate-100">
          {currentQuestion.prompt}
        </p>
      </Card>

      {phase === 'prompt' ? (
        <div className="space-y-3">
          {!preferReveal || settings.practicePreference === 'typing' ? (
            <>
              <label htmlFor="answer" className="sr-only">
                Your answer
              </label>
              <SyntaxAutocompleteInput
                id="answer"
                value={draftAnswer}
                onChange={setDraftAnswer}
                rows={4}
                placeholder="Type the syntax…"
                aria-label="Your answer"
              />
              <div className="grid grid-cols-2 gap-2">
                <PrimaryButton onClick={submitTyped}>Check</PrimaryButton>
                <SecondaryButton onClick={reveal}>Reveal</SecondaryButton>
              </div>
            </>
          ) : (
            <div className="grid gap-2">
              <PrimaryButton onClick={reveal}>Reveal answer</PrimaryButton>
              <div className="grid grid-cols-3 gap-2">
                <SecondaryButton
                  onClick={() => {
                    reveal()
                    selfGrade('correct')
                  }}
                >
                  I knew it
                </SecondaryButton>
                <SecondaryButton
                  onClick={() => {
                    reveal()
                    selfGrade('unsure')
                  }}
                >
                  Unsure
                </SecondaryButton>
                <SecondaryButton
                  onClick={() => {
                    reveal()
                    selfGrade('incorrect')
                  }}
                >
                  Wrong
                </SecondaryButton>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <AnswerCard
            evaluation={lastEvaluation}
            answer={currentQuestion.answer}
            explanation={currentQuestion.explanation}
            userAnswer={draftAnswer || undefined}
            showSelfGrade={
              currentQuestion.gradeMode === 'self' || lastEvaluation === 'close' || lastEvaluation === 'revealed'
            }
            onSelfGrade={selfGrade}
            onGotIt={() => {
              markGotIt()
              goNext()
            }}
            onNeedPractice={() => {
              markNeedPractice()
              goNext()
            }}
          />
          <SecondaryButton onClick={goNext}>Next question</SecondaryButton>
        </div>
      )}
    </div>
  )
}

function SessionSetup({
  onStart,
  defaultSize,
}: {
  onStart: (input: { mode: SessionMode; size?: number | null; category?: UiCategory | 'All' }) => void
  defaultSize: 10 | 20 | 50
}) {
  return (
    <div>
      <PageHeader title="Practice" subtitle="Active recall — type the syntax when you can." />
      <Card className="mb-4">
        <h2 className="mb-3 text-sm font-semibold text-slate-500 uppercase">Session</h2>
        <div className="grid grid-cols-2 gap-2">
          <SecondaryButton onClick={() => onStart({ mode: 'quick10', size: 10 })}>
            Quick 10
          </SecondaryButton>
          <SecondaryButton onClick={() => onStart({ mode: 'quick20', size: 20 })}>
            20 Questions
          </SecondaryButton>
          <SecondaryButton onClick={() => onStart({ mode: 'quick50', size: 50 })}>
            50 Questions
          </SecondaryButton>
          <SecondaryButton onClick={() => onStart({ mode: 'endless', size: null })}>
            Endless
          </SecondaryButton>
          <SecondaryButton onClick={() => onStart({ mode: 'weak', size: defaultSize })}>
            Weak Areas
          </SecondaryButton>
          <SecondaryButton onClick={() => onStart({ mode: 'incorrect', size: defaultSize })}>
            Incorrect Only
          </SecondaryButton>
          <SecondaryButton onClick={() => onStart({ mode: 'new', size: defaultSize })}>
            New Questions
          </SecondaryButton>
          <SecondaryButton onClick={() => onStart({ mode: 'mixed', size: defaultSize })}>
            Mixed Review
          </SecondaryButton>
        </div>
      </Card>
      <Card>
        <h2 className="mb-3 text-sm font-semibold text-slate-500 uppercase">Categories</h2>
        <div className="grid gap-2">
          <SecondaryButton onClick={() => onStart({ mode: 'mixed', category: 'All', size: defaultSize })}>
            All Categories
          </SecondaryButton>
          {UI_CATEGORIES.map((c) => (
            <SecondaryButton
              key={c}
              onClick={() => onStart({ mode: 'category', category: c, size: defaultSize })}
            >
              {c}
            </SecondaryButton>
          ))}
        </div>
      </Card>
    </div>
  )
}
