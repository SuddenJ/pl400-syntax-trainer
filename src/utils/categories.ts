import type { Question, UiCategory } from '../types/question'

const CATEGORY_MAP: { match: RegExp; ui: UiCategory }[] = [
  { match: /Delegation/i, ui: 'Delegation' },
  { match: /Dataverse Power Fx/i, ui: 'Dataverse Power Fx' },
  { match: /Plug-in/i, ui: 'Dataverse plug-ins' },
  { match: /Dataverse SDK|custom APIs/i, ui: 'Dataverse SDK' },
  { match: /Client API|Xrm/i, ui: 'Xrm / Client API' },
  { match: /^PCF/i, ui: 'PCF' },
  { match: /Power Fx/i, ui: 'Power Fx' },
]

export const UI_CATEGORIES: UiCategory[] = [
  'Power Fx',
  'Delegation',
  'Dataverse Power Fx',
  'Dataverse plug-ins',
  'Dataverse SDK',
  'Xrm / Client API',
  'PCF',
]

export function toUiCategory(category: string): UiCategory {
  for (const entry of CATEGORY_MAP) {
    if (entry.match.test(category)) return entry.ui
  }
  return 'Power Fx'
}

export function filterByUiCategory(questions: Question[], ui: UiCategory | 'All'): Question[] {
  if (ui === 'All') return questions
  return questions.filter((q) => toUiCategory(q.category) === ui)
}

export function uniqueTopics(questions: Question[]): string[] {
  return [...new Set(questions.map((q) => q.topic))].sort((a, b) => a.localeCompare(b))
}
