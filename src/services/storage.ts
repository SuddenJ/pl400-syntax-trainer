import type { AppSettings, AppStore, QuestionStats } from '../types/question'
import { emptyStats, masteryLabelFromScore } from './questionScheduler'

export const STORAGE_KEY = 'pl400-syntax-trainer.v1'

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'system',
  defaultSessionSize: 10,
  practicePreference: 'mixed',
}

export function createDefaultStore(): AppStore {
  return {
    schemaVersion: 1,
    questionStats: {},
    settings: { ...DEFAULT_SETTINGS },
    studyDays: [],
    sessionHistory: [],
    activeSession: null,
  }
}

export function loadStore(raw?: string | null): AppStore {
  try {
    const text = raw ?? (typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null)
    if (!text) return createDefaultStore()
    const parsed = JSON.parse(text) as Partial<AppStore> & { schemaVersion?: number }
    return migrateStore(parsed)
  } catch {
    return createDefaultStore()
  }
}

export function saveStore(store: AppStore): void {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

export function migrateStore(parsed: Partial<AppStore> & { schemaVersion?: number }): AppStore {
  const base = createDefaultStore()
  const version = parsed.schemaVersion ?? 0
  if (version > 1) {
    // Future versions unknown — best effort
  }

  const questionStats: Record<string, QuestionStats> = {}
  for (const [id, stats] of Object.entries(parsed.questionStats ?? {})) {
    const merged = { ...emptyStats(), ...stats }
    merged.masteryLabel = masteryLabelFromScore(merged.masteryScore, merged.attempts)
    questionStats[id] = merged
  }

  return {
    schemaVersion: 1,
    questionStats,
    settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
    studyDays: Array.isArray(parsed.studyDays) ? parsed.studyDays : base.studyDays,
    sessionHistory: Array.isArray(parsed.sessionHistory) ? parsed.sessionHistory : base.sessionHistory,
    activeSession: parsed.activeSession ?? null,
  }
}

export function exportStoreJson(store: AppStore): string {
  return `${JSON.stringify(store, null, 2)}\n`
}

export function importStoreJson(json: string): AppStore {
  const parsed = JSON.parse(json) as Partial<AppStore>
  return migrateStore(parsed)
}

export function resetStudyData(settings: AppSettings): AppStore {
  return {
    ...createDefaultStore(),
    settings: { ...settings },
  }
}
