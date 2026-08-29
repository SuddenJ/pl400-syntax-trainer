import { questions } from '../data/questions'
import { extractIdentifiers } from '../utils/normalize'

const TOKEN_CHAR = /[A-Za-z0-9_.]/

/** Build deduplicated syntax vocabulary from the question bank (canonical casing). */
export function buildSyntaxCorpus(source = questions): string[] {
  const byLower = new Map<string, string>()

  const add = (raw: string) => {
    const value = raw.trim()
    if (value.length < 2) return
    // Skip long prose answers — they are not IntelliSense targets
    if (value.length > 80 && !TOKEN_CHAR.test(value[0] ?? '')) return
    if (/\s/.test(value) && value.length > 60 && !value.includes('(')) return
    const key = value.toLowerCase()
    if (!byLower.has(key)) byLower.set(key, value)
  }

  for (const q of source) {
    add(q.answer)
    for (const a of q.acceptedAnswers ?? []) add(a)
    for (const id of extractIdentifiers(q.answer)) add(id)
    for (const a of q.acceptedAnswers ?? []) {
      for (const id of extractIdentifiers(a)) add(id)
    }
  }

  return [...byLower.values()].sort((a, b) => a.localeCompare(b))
}

let cachedCorpus: string[] | null = null

export function getSyntaxCorpus(): string[] {
  if (!cachedCorpus) cachedCorpus = buildSyntaxCorpus()
  return cachedCorpus
}

/** For tests — reset memoized corpus. */
export function resetSyntaxCorpusCache(): void {
  cachedCorpus = null
}

export type TokenRange = { token: string; start: number; end: number }

/** Current identifier-like token at caret (letters, digits, underscore, dot). */
export function getTokenAt(value: string, caret: number): TokenRange {
  const pos = Math.max(0, Math.min(caret, value.length))
  let start = pos
  while (start > 0 && TOKEN_CHAR.test(value[start - 1]!)) start -= 1
  let end = pos
  while (end < value.length && TOKEN_CHAR.test(value[end]!)) end += 1
  return { token: value.slice(start, end), start, end }
}

export function getSuggestions(
  value: string,
  caret: number,
  limit = 8,
  corpus: string[] = getSyntaxCorpus(),
): string[] {
  const { token } = getTokenAt(value, caret)
  if (token.length < 1) return []

  const needle = token.toLowerCase()
  const matches = corpus.filter((item) => item.toLowerCase().startsWith(needle))

  matches.sort((a, b) => {
    const al = a.toLowerCase()
    const bl = b.toLowerCase()
    // Prefer exact token match first
    if (al === needle && bl !== needle) return -1
    if (bl === needle && al !== needle) return 1
    // Then shorter completions
    if (a.length !== b.length) return a.length - b.length
    return a.localeCompare(b)
  })

  // Don't list the token alone if it's already complete and unique — still fine to show
  return matches.slice(0, limit)
}

export function applySuggestion(
  value: string,
  caret: number,
  suggestion: string,
): { value: string; caret: number } {
  const { start, end } = getTokenAt(value, caret)
  const next = `${value.slice(0, start)}${suggestion}${value.slice(end)}`
  const nextCaret = start + suggestion.length
  return { value: next, caret: nextCaret }
}
