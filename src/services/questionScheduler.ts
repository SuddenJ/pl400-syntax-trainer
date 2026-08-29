import type { MasteryLabel, Question, QuestionStats, SessionMode, UiCategory } from '../types/question'
import { filterByUiCategory } from '../utils/categories'

export function emptyStats(): QuestionStats {
  return {
    attempts: 0,
    correct: 0,
    incorrect: 0,
    unsure: 0,
    streak: 0,
    masteryScore: 0,
    needsPractice: false,
    masteryLabel: 'new',
  }
}

export function masteryLabelFromScore(score: number, attempts: number): MasteryLabel {
  if (attempts === 0) return 'new'
  if (score >= 0.9 && attempts >= 3) return 'mastered'
  if (score >= 0.75) return 'strong'
  if (score >= 0.5) return 'familiar'
  return 'learning'
}

export type OutcomeKind = 'correct' | 'incorrect' | 'unsure'

export function applyOutcome(stats: QuestionStats, outcome: OutcomeKind, now = new Date()): QuestionStats {
  const next = { ...stats }
  next.attempts += 1
  next.lastSeenAt = now.toISOString()

  if (outcome === 'correct') {
    next.correct += 1
    next.streak += 1
    next.masteryScore = clamp(next.masteryScore + (next.streak >= 3 ? 0.18 : 0.12))
    next.nextDueAt = addHours(now, next.streak >= 3 ? 72 : 24).toISOString()
  } else if (outcome === 'unsure') {
    next.unsure += 1
    next.streak = 0
    next.masteryScore = clamp(next.masteryScore - 0.06)
    next.needsPractice = true
    next.nextDueAt = addHours(now, 4).toISOString()
  } else {
    next.incorrect += 1
    next.streak = 0
    next.masteryScore = clamp(next.masteryScore - 0.2)
    next.needsPractice = true
    next.nextDueAt = addHours(now, 1).toISOString()
  }

  next.masteryLabel = masteryLabelFromScore(next.masteryScore, next.attempts)
  if (next.masteryLabel === 'mastered') next.needsPractice = false
  return next
}

function clamp(n: number) {
  return Math.max(0, Math.min(1, n))
}

function addHours(date: Date, hours: number) {
  return new Date(date.getTime() + hours * 60 * 60 * 1000)
}

export type ScheduleOptions = {
  mode: SessionMode
  size: number | null
  category?: UiCategory | 'All'
  topic?: string
  stats: Record<string, QuestionStats>
  now?: Date
  random?: () => number
}

export function buildSessionQueue(questions: Question[], options: ScheduleOptions): string[] {
  const rnd = options.random ?? Math.random
  const now = options.now ?? new Date()
  let pool = [...questions]

  if (options.category && options.category !== 'All') {
    pool = filterByUiCategory(pool, options.category)
  }
  if (options.topic) {
    pool = pool.filter((q) => q.topic === options.topic)
  }

  const statsOf = (id: string) => options.stats[id] ?? emptyStats()

  if (options.mode === 'incorrect') {
    pool = pool.filter((q) => {
      const s = statsOf(q.id)
      return s.incorrect > 0 || s.needsPractice
    })
  } else if (options.mode === 'new') {
    pool = pool.filter((q) => statsOf(q.id).attempts === 0)
  } else if (options.mode === 'weak' || options.mode === 'mistakes') {
    pool = pool.filter((q) => {
      const s = statsOf(q.id)
      return (
        s.needsPractice ||
        s.incorrect > 0 ||
        s.unsure > 0 ||
        (s.attempts > 0 && s.correct / s.attempts < 0.6) ||
        s.masteryScore < 0.5
      )
    })
  }

  if (pool.length === 0) pool = [...questions]

  const scored = pool.map((q) => ({
    id: q.id,
    score: priorityScore(statsOf(q.id), now),
    noise: rnd(),
  }))

  scored.sort((a, b) => b.score - a.score || a.noise - b.noise)

  let queue = scored.map((s) => s.id)

  // Avoid immediate duplicates by ensuring uniqueness in initial queue
  queue = dedupePreserveOrder(queue)

  if (options.size != null && options.size > 0) {
    queue = queue.slice(0, options.size)
  }

  // Light shuffle of top band while keeping priority bias
  queue = softShuffle(queue, rnd)

  return ensureNoAdjacentDuplicates(queue)
}

/** Inject an incorrect question into positions +3..+8 of remaining queue. */
export function scheduleResurface(
  remaining: string[],
  questionId: string,
  random: () => number = Math.random,
): string[] {
  const next = remaining.filter((id) => id !== questionId)
  if (next.length === 0) return [questionId]

  const min = Math.min(2, next.length) // 0-based: +3 means index 2
  const max = Math.min(7, next.length) // +8 → index 7
  const low = Math.min(min, max)
  const high = Math.max(min, max)
  const slot = low + Math.floor(random() * (high - low + 1))
  const insertAt = Math.min(slot, next.length)
  next.splice(insertAt, 0, questionId)
  return next
}

function priorityScore(stats: QuestionStats, now: Date): number {
  if (stats.attempts === 0) return 1000 + (1 - stats.masteryScore) * 10
  if (stats.needsPractice) return 850
  if (stats.incorrect > 0 && stats.lastSeenAt) {
    const hours = (now.getTime() - Date.parse(stats.lastSeenAt)) / 3600000
    if (hours < 24) return 900 - hours
  }
  if (stats.masteryScore < 0.4) return 700 + (0.4 - stats.masteryScore) * 100
  if (stats.nextDueAt && Date.parse(stats.nextDueAt) <= now.getTime()) return 600
  if (stats.lastSeenAt) {
    const days = (now.getTime() - Date.parse(stats.lastSeenAt)) / 86400000
    return 300 + Math.min(days, 30)
  }
  return 100 + (1 - stats.masteryScore) * 50
}

function dedupePreserveOrder(ids: string[]) {
  const seen = new Set<string>()
  const out: string[] = []
  for (const id of ids) {
    if (seen.has(id)) continue
    seen.add(id)
    out.push(id)
  }
  return out
}

function softShuffle(ids: string[], rnd: () => number) {
  const copy = [...ids]
  // Fisher-Yates on windows of 5 to keep priority roughly intact
  for (let i = 0; i < copy.length; i += 5) {
    const end = Math.min(i + 5, copy.length)
    for (let j = end - 1; j > i; j -= 1) {
      const k = i + Math.floor(rnd() * (j - i + 1))
      ;[copy[j], copy[k]] = [copy[k], copy[j]]
    }
  }
  return copy
}

function ensureNoAdjacentDuplicates(ids: string[]) {
  if (ids.length < 2) return ids
  const out = [...ids]
  for (let i = 1; i < out.length; i += 1) {
    if (out[i] === out[i - 1]) {
      const swapWith = out.findIndex((id, idx) => idx > i && id !== out[i])
      if (swapWith !== -1) {
        ;[out[i], out[swapWith]] = [out[swapWith], out[i]]
      }
    }
  }
  return out
}
