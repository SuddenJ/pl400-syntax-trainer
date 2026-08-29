import { describe, expect, it, beforeEach } from 'vitest'
import {
  STORAGE_KEY,
  createDefaultStore,
  exportStoreJson,
  importStoreJson,
  loadStore,
  migrateStore,
  resetStudyData,
  saveStore,
} from '../../src/services/storage'
import { computeOverallMastery, computeStreak, summarizeSession } from '../../src/services/progress'
import type { Question } from '../../src/types/question'

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('round-trips through localStorage', () => {
    const store = createDefaultStore()
    store.studyDays = ['2026-08-30']
    saveStore(store)
    const loaded = loadStore()
    expect(loaded.studyDays).toEqual(['2026-08-30'])
    expect(loaded.schemaVersion).toBe(1)
    expect(localStorage.getItem(STORAGE_KEY)).toBeTruthy()
  })

  it('migrates missing fields', () => {
    const migrated = migrateStore({ schemaVersion: 0 } as never)
    expect(migrated.settings.defaultSessionSize).toBe(10)
    expect(migrated.questionStats).toEqual({})
  })

  it('exports and imports progress JSON', () => {
    const store = createDefaultStore()
    store.questionStats['X'] = {
      attempts: 2,
      correct: 1,
      incorrect: 1,
      unsure: 0,
      streak: 0,
      masteryScore: 0.4,
      needsPractice: true,
      masteryLabel: 'learning',
    }
    const json = exportStoreJson(store)
    const imported = importStoreJson(json)
    expect(imported.questionStats.X.attempts).toBe(2)
  })

  it('resets study data but keeps settings', () => {
    const reset = resetStudyData({
      theme: 'dark',
      defaultSessionSize: 20,
      practicePreference: 'typing',
    })
    expect(reset.questionStats).toEqual({})
    expect(reset.settings.theme).toBe('dark')
    expect(reset.settings.defaultSessionSize).toBe(20)
  })
})

describe('progress calculations', () => {
  it('computes overall mastery', () => {
    const questions = [
      { id: 'A' },
      { id: 'B' },
    ] as Question[]
    const mastery = computeOverallMastery(questions, {
      A: {
        attempts: 1,
        correct: 1,
        incorrect: 0,
        unsure: 0,
        streak: 1,
        masteryScore: 1,
        needsPractice: false,
        masteryLabel: 'mastered',
      },
      B: {
        attempts: 0,
        correct: 0,
        incorrect: 0,
        unsure: 0,
        streak: 0,
        masteryScore: 0,
        needsPractice: false,
        masteryLabel: 'new',
      },
    })
    expect(mastery).toBe(0.5)
  })

  it('computes streak from study days', () => {
    const today = '2026-08-30'
    const { current, best } = computeStreak(['2026-08-28', '2026-08-29', '2026-08-30'], today)
    expect(current).toBe(3)
    expect(best).toBeGreaterThanOrEqual(3)
  })

  it('summarizes session completion', () => {
    const qmap = new Map<string, Question>([
      [
        'A',
        {
          id: 'A',
          category: 'Power Fx — Core syntax',
          topic: 'Filter',
          origin: 'GAP',
          prompt: 'p',
          answer: 'Filter',
          acceptedAnswers: ['Filter'],
          gradeMode: 'exact',
        },
      ],
    ])
    const summary = summarizeSession({
      id: 's1',
      mode: 'quick10',
      startedAt: new Date().toISOString(),
      results: [{ questionId: 'A', evaluation: 'correct' }],
      questionsById: qmap,
      statsBefore: {},
      statsAfter: {
        A: {
          attempts: 3,
          correct: 3,
          incorrect: 0,
          unsure: 0,
          streak: 3,
          masteryScore: 0.95,
          needsPractice: false,
          masteryLabel: 'mastered',
        },
      },
    })
    expect(summary.correct).toBe(1)
    expect(summary.total).toBe(1)
    expect(summary.newlyMastered).toBe(1)
  })
})
