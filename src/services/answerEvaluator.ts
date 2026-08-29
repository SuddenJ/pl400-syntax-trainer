import type { EvaluationResult, GradeMode, Question } from '../types/question'
import { identifiersConflict, normalizeAnswer } from '../utils/normalize'

export type EvaluateOptions = {
  gradeMode?: GradeMode
}

export function evaluateAnswer(
  userAnswer: string,
  question: Pick<Question, 'answer' | 'acceptedAnswers' | 'gradeMode'>,
  options: EvaluateOptions = {},
): EvaluationResult {
  const mode = options.gradeMode ?? question.gradeMode
  if (mode === 'self') return 'close'

  const user = userAnswer.trim()
  if (!user) return 'incorrect'

  const accepted = question.acceptedAnswers?.length
    ? question.acceptedAnswers
    : [question.answer]

  const userNorm = normalizeAnswer(user)
  for (const candidate of accepted) {
    if (normalizeAnswer(candidate) === userNorm) return 'correct'
  }

  // Close: normalized containment of expected short answer inside longer user text,
  // but reject sibling identifiers.
  const expected = question.answer
  if (identifiersConflict(user, expected)) return 'incorrect'

  const expectedNorm = normalizeAnswer(expected)
  if (
    expectedNorm.length >= 3 &&
    (userNorm.includes(expectedNorm) || expectedNorm.includes(userNorm)) &&
    Math.abs(userNorm.length - expectedNorm.length) <= Math.max(8, expectedNorm.length * 0.35)
  ) {
    return 'close'
  }

  // Soft punctuation-only differences already handled by normalize; leftover = incorrect
  const userCompact = userNorm.replace(/[^a-z0-9]/g, '')
  const expectedCompact = expectedNorm.replace(/[^a-z0-9]/g, '')
  if (userCompact === expectedCompact && userCompact.length > 0) return 'correct'

  return 'incorrect'
}
