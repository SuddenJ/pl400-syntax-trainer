import type { Question } from '../types/question'

export type ScratchpadDrill = {
  id: string
  prompt: string
  expected: string
  hint?: string
  category: string
  topic: string
}

const CODE_LIKE =
  /[(){};=]|Filter|LookUp|Patch|Set\s*\(|With\s*\(|GetService|Xrm\.|executionContext|IPlugin|IOrganization|ITracing|ServiceClient|updateView|getOutputs|notifyOutputChanged|SharedVariables|PreEntityImages/

export function isScratchpadCandidate(question: Question): boolean {
  if (question.gradeMode === 'self') return false
  return CODE_LIKE.test(question.answer) || question.answer.includes('(')
}

export function buildScratchpadDrills(questions: Question[]): ScratchpadDrill[] {
  return questions.filter(isScratchpadCandidate).map((q) => ({
    id: q.id,
    prompt: q.prompt,
    expected: q.answer,
    hint: q.explanation,
    category: q.category,
    topic: q.topic,
  }))
}

export function pickNextDrill(
  drills: ScratchpadDrill[],
  currentId: string | undefined,
  random = Math.random,
): ScratchpadDrill | undefined {
  if (drills.length === 0) return undefined
  if (drills.length === 1) return drills[0]
  const others = drills.filter((d) => d.id !== currentId)
  return others[Math.floor(random() * others.length)]
}
