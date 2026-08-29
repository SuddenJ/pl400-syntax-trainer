import { describe, expect, it } from 'vitest'
import {
  buildSessionQueue,
  emptyStats,
  scheduleResurface,
  applyOutcome,
} from '../../src/services/questionScheduler'
import type { Question, QuestionStats } from '../../src/types/question'

function q(id: string, category = 'Power Fx — Core syntax'): Question {
  return {
    id,
    category,
    topic: 't',
    origin: 'GAP',
    prompt: 'p',
    answer: 'a',
    acceptedAnswers: ['a'],
    gradeMode: 'exact',
  }
}

describe('questionScheduler', () => {
  it('prioritizes never attempted questions', () => {
    const questions = [q('A'), q('B'), q('C')]
    const stats: Record<string, QuestionStats> = {
      B: { ...emptyStats(), attempts: 5, correct: 5, masteryScore: 0.95, masteryLabel: 'mastered' },
      C: { ...emptyStats(), attempts: 3, incorrect: 2, masteryScore: 0.2, needsPractice: true, masteryLabel: 'learning' },
    }
    const queue = buildSessionQueue(questions, {
      mode: 'mixed',
      size: 3,
      stats,
      random: () => 0.5,
    })
    expect(queue[0]).toBe('A')
  })

  it('avoids immediate duplicate where practical', () => {
    const questions = Array.from({ length: 10 }, (_, i) => q(`Q${i}`))
    const queue = buildSessionQueue(questions, {
      mode: 'mixed',
      size: 10,
      stats: {},
      random: () => 0.1,
    })
    for (let i = 1; i < queue.length; i += 1) {
      expect(queue[i]).not.toBe(queue[i - 1])
    }
  })

  it('resurfaces incorrect questions within 3–8 positions', () => {
    const remaining = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']
    const next = scheduleResurface(remaining, 'X', () => 0)
    const idx = next.indexOf('X')
    // insertAt uses min=2 (+3) when random=0
    expect(idx).toBeGreaterThanOrEqual(2)
    expect(idx).toBeLessThanOrEqual(7)
  })

  it('decreases mastery on incorrect', () => {
    const before = { ...emptyStats(), attempts: 2, correct: 2, masteryScore: 0.5, masteryLabel: 'familiar' as const }
    const after = applyOutcome(before, 'incorrect')
    expect(after.masteryScore).toBeLessThan(before.masteryScore)
    expect(after.needsPractice).toBe(true)
    expect(after.streak).toBe(0)
  })
})
