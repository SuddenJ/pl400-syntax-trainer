import bank from '../data/questions.generated.json'
import type { Question, QuestionBankFile } from '../types/question'

const data = bank as QuestionBankFile

export const questionBankMeta = {
  generatedAt: data.generatedAt,
  source: data.source,
  count: data.count,
}

export const questions: Question[] = data.questions

export function getQuestionById(id: string): Question | undefined {
  return questions.find((q) => q.id === id)
}
