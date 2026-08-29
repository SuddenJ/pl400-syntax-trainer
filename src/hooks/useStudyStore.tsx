import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type {
  ActiveSession,
  AppSettings,
  AppStore,
  QuestionStats,
  SessionSummary,
} from '../types/question'
import { localDateKey } from '../utils/dates'
import {
  exportStoreJson,
  importStoreJson,
  loadStore,
  resetStudyData,
  saveStore,
} from '../services/storage'

type StudyContextValue = {
  store: AppStore
  settings: AppSettings
  updateSettings: (patch: Partial<AppSettings>) => void
  getQuestionStats: (id: string) => QuestionStats | undefined
  setQuestionStats: (id: string, stats: QuestionStats) => void
  markStudiedToday: () => void
  setActiveSession: (session: ActiveSession | null) => void
  completeSession: (summary: SessionSummary) => void
  resetAll: () => void
  exportJson: () => string
  importJson: (json: string) => void
}

const StudyContext = createContext<StudyContextValue | null>(null)

export function StudyProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<AppStore>(() => loadStore())

  useEffect(() => {
    saveStore(store)
  }, [store])

  useEffect(() => {
    const root = document.documentElement
    const theme = store.settings.theme
    const apply = (dark: boolean) => {
      root.classList.toggle('dark', dark)
    }
    if (theme === 'dark') apply(true)
    else if (theme === 'light') apply(false)
    else {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      apply(mq.matches)
      const handler = (e: MediaQueryListEvent) => apply(e.matches)
      mq.addEventListener('change', handler)
      return () => mq.removeEventListener('change', handler)
    }
  }, [store.settings.theme])

  const updateSettings = useCallback((patch: Partial<AppSettings>) => {
    setStore((s) => ({ ...s, settings: { ...s.settings, ...patch } }))
  }, [])

  const getQuestionStats = useCallback(
    (id: string) => store.questionStats[id],
    [store.questionStats],
  )

  const setQuestionStats = useCallback((id: string, stats: QuestionStats) => {
    setStore((s) => ({
      ...s,
      questionStats: { ...s.questionStats, [id]: stats },
    }))
  }, [])

  const markStudiedToday = useCallback(() => {
    const day = localDateKey()
    setStore((s) => (s.studyDays.includes(day) ? s : { ...s, studyDays: [...s.studyDays, day] }))
  }, [])

  const setActiveSession = useCallback((session: ActiveSession | null) => {
    setStore((s) => ({ ...s, activeSession: session }))
  }, [])

  const completeSession = useCallback((summary: SessionSummary) => {
    setStore((s) => ({
      ...s,
      activeSession: null,
      sessionHistory: [summary, ...s.sessionHistory].slice(0, 50),
    }))
  }, [])

  const resetAll = useCallback(() => {
    setStore((s) => resetStudyData(s.settings))
  }, [])

  const exportJson = useCallback(() => exportStoreJson(store), [store])

  const importJson = useCallback((json: string) => {
    setStore(importStoreJson(json))
  }, [])

  const value = useMemo(
    () => ({
      store,
      settings: store.settings,
      updateSettings,
      getQuestionStats,
      setQuestionStats,
      markStudiedToday,
      setActiveSession,
      completeSession,
      resetAll,
      exportJson,
      importJson,
    }),
    [
      store,
      updateSettings,
      getQuestionStats,
      setQuestionStats,
      markStudiedToday,
      setActiveSession,
      completeSession,
      resetAll,
      exportJson,
      importJson,
    ],
  )

  return <StudyContext.Provider value={value}>{children}</StudyContext.Provider>
}

export function useStudy() {
  const ctx = useContext(StudyContext)
  if (!ctx) throw new Error('useStudy must be used within StudyProvider')
  return ctx
}

export function useSettings() {
  const { settings, updateSettings } = useStudy()
  return { settings, updateSettings }
}

export function useQuestionProgress() {
  const { store, getQuestionStats, setQuestionStats } = useStudy()
  return {
    questionStats: store.questionStats,
    getQuestionStats,
    setQuestionStats,
  }
}
