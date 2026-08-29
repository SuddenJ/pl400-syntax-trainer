export type Origin = 'DOC' | 'GAP'
export type GradeMode = 'exact' | 'self'
export type EvaluationResult = 'correct' | 'close' | 'incorrect'
export type MasteryLabel = 'new' | 'learning' | 'familiar' | 'strong' | 'mastered'
export type PracticePreference = 'mixed' | 'typing' | 'reveal'
export type ThemeMode = 'system' | 'light' | 'dark'
export type SessionMode =
  | 'quick10'
  | 'quick20'
  | 'quick50'
  | 'endless'
  | 'weak'
  | 'incorrect'
  | 'new'
  | 'mixed'
  | 'mistakes'
  | 'category'

export type Question = {
  id: string
  category: string
  topic: string
  origin: Origin
  prompt: string
  answer: string
  explanation?: string
  acceptedAnswers: string[]
  gradeMode: GradeMode
}

export type QuestionBankFile = {
  generatedAt: string
  source: string
  count: number
  questions: Question[]
}

export type QuestionStats = {
  attempts: number
  correct: number
  incorrect: number
  unsure: number
  streak: number
  masteryScore: number
  lastSeenAt?: string
  nextDueAt?: string
  needsPractice: boolean
  masteryLabel: MasteryLabel
}

export type AppSettings = {
  theme: ThemeMode
  defaultSessionSize: 10 | 20 | 50
  practicePreference: PracticePreference
}

export type SessionAnswerRecord = {
  questionId: string
  evaluation: EvaluationResult | 'revealed' | 'knew' | 'unsure' | 'wrong'
  userAnswer?: string
  selfGrade?: 'correct' | 'incorrect' | 'unsure'
  markedNeedPractice?: boolean
  answeredAt: string
}

export type ActiveSession = {
  id: string
  mode: SessionMode
  questionIds: string[]
  currentIndex: number
  results: SessionAnswerRecord[]
  categoryFilter?: string
  topicFilter?: string
  startedAt: string
  expiresAt: string
  size: number | null
}

export type SessionSummary = {
  id: string
  mode: SessionMode
  startedAt: string
  completedAt: string
  total: number
  correct: number
  incorrect: number
  unsure: number
  newlyMastered: number
  needReview: number
  categoryBreakdown: Record<string, { correct: number; total: number }>
}

export type AppStore = {
  schemaVersion: 1
  questionStats: Record<string, QuestionStats>
  settings: AppSettings
  studyDays: string[]
  sessionHistory: SessionSummary[]
  activeSession: ActiveSession | null
}

export type UiCategory =
  | 'Power Fx'
  | 'Delegation'
  | 'Dataverse Power Fx'
  | 'Dataverse plug-ins'
  | 'Dataverse SDK'
  | 'Xrm / Client API'
  | 'PCF'
