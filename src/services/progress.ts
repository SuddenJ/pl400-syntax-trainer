import type { Question, QuestionStats, SessionSummary } from '../types/question'
import { toUiCategory, UI_CATEGORIES } from '../utils/categories'
import { localDateKey } from '../utils/dates'
import { emptyStats } from './questionScheduler'

export function getStats(map: Record<string, QuestionStats>, id: string): QuestionStats {
  return map[id] ?? emptyStats()
}

export function computeOverallMastery(questions: Question[], stats: Record<string, QuestionStats>): number {
  if (questions.length === 0) return 0
  const sum = questions.reduce((acc, q) => acc + getStats(stats, q.id).masteryScore, 0)
  return sum / questions.length
}

export function countByMastery(questions: Question[], stats: Record<string, QuestionStats>) {
  const counts = { new: 0, learning: 0, familiar: 0, strong: 0, mastered: 0, attempted: 0 }
  for (const q of questions) {
    const s = getStats(stats, q.id)
    counts[s.masteryLabel] += 1
    if (s.attempts > 0) counts.attempted += 1
  }
  return counts
}

export function categoryMastery(questions: Question[], stats: Record<string, QuestionStats>) {
  return UI_CATEGORIES.map((ui) => {
    const qs = questions.filter((q) => toUiCategory(q.category) === ui)
    const mastery = computeOverallMastery(qs, stats)
    const accuracy = accuracyFor(qs, stats)
    return { category: ui, mastery, accuracy, count: qs.length }
  })
}

export function accuracyFor(questions: Question[], stats: Record<string, QuestionStats>): number | null {
  let correct = 0
  let attempts = 0
  for (const q of questions) {
    const s = getStats(stats, q.id)
    correct += s.correct
    attempts += s.attempts
  }
  if (attempts === 0) return null
  return correct / attempts
}

export function weakestCategory(questions: Question[], stats: Record<string, QuestionStats>) {
  const rows = categoryMastery(questions, stats).filter((r) => {
    const qs = questions.filter((q) => toUiCategory(q.category) === r.category)
    return qs.some((q) => getStats(stats, q.id).attempts > 0)
  })
  if (rows.length === 0) return null
  return [...rows].sort((a, b) => a.mastery - b.mastery)[0]
}

export function dueCount(questions: Question[], stats: Record<string, QuestionStats>, now = new Date()) {
  return questions.filter((q) => {
    const s = getStats(stats, q.id)
    if (s.attempts === 0) return true
    if (s.needsPractice) return true
    if (s.nextDueAt && Date.parse(s.nextDueAt) <= now.getTime()) return true
    return false
  }).length
}

export function computeStreak(studyDays: string[], today = localDateKey()): { current: number; best: number } {
  const set = new Set(studyDays)
  let current = 0
  let cursor = today
  while (set.has(cursor)) {
    current += 1
    const d = new Date(`${cursor}T12:00:00`)
    d.setDate(d.getDate() - 1)
    cursor = localDateKey(d)
  }

  const sorted = [...studyDays].sort()
  let best = 0
  let run = 0
  let prev: string | null = null
  for (const day of sorted) {
    if (!prev) {
      run = 1
    } else {
      const prevDate = new Date(`${prev}T12:00:00`)
      prevDate.setDate(prevDate.getDate() + 1)
      run = localDateKey(prevDate) === day ? run + 1 : 1
    }
    best = Math.max(best, run)
    prev = day
  }

  return { current, best: Math.max(best, current) }
}

export function questionsCompletedToday(stats: Record<string, QuestionStats>, today = localDateKey()) {
  return Object.values(stats).filter((s) => s.lastSeenAt && localDateKey(new Date(s.lastSeenAt)) === today)
    .length
}

export function mistakeQuestions(questions: Question[], stats: Record<string, QuestionStats>) {
  return questions.filter((q) => {
    const s = getStats(stats, q.id)
    return s.incorrect > 0 || s.unsure > 0 || s.needsPractice
  })
}

export function summarizeSession(input: {
  id: string
  mode: SessionSummary['mode']
  startedAt: string
  results: { questionId: string; evaluation: string }[]
  questionsById: Map<string, Question>
  statsBefore: Record<string, QuestionStats>
  statsAfter: Record<string, QuestionStats>
}): SessionSummary {
  const total = input.results.length
  let correct = 0
  let incorrect = 0
  let unsure = 0
  const categoryBreakdown: Record<string, { correct: number; total: number }> = {}

  for (const r of input.results) {
    const q = input.questionsById.get(r.questionId)
    const cat = q ? toUiCategory(q.category) : 'Other'
    categoryBreakdown[cat] ??= { correct: 0, total: 0 }
    categoryBreakdown[cat].total += 1
    if (r.evaluation === 'correct' || r.evaluation === 'knew') {
      correct += 1
      categoryBreakdown[cat].correct += 1
    } else if (r.evaluation === 'unsure') {
      unsure += 1
    } else {
      incorrect += 1
    }
  }

  let newlyMastered = 0
  let needReview = 0
  for (const r of input.results) {
    const before = input.statsBefore[r.questionId]?.masteryLabel
    const after = input.statsAfter[r.questionId]?.masteryLabel
    if (before !== 'mastered' && after === 'mastered') newlyMastered += 1
    if (input.statsAfter[r.questionId]?.needsPractice) needReview += 1
  }

  return {
    id: input.id,
    mode: input.mode,
    startedAt: input.startedAt,
    completedAt: new Date().toISOString(),
    total,
    correct,
    incorrect,
    unsure,
    newlyMastered,
    needReview,
    categoryBreakdown,
  }
}
