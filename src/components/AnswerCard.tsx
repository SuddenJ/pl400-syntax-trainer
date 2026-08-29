import { CheckCircle2, CircleHelp, XCircle } from 'lucide-react'
import type { EvaluationResult } from '../types/question'
import { CodeBlock } from './CodeBlock'
import { PrimaryButton, SecondaryButton } from './ui'

export function AnswerCard({
  evaluation,
  answer,
  explanation,
  userAnswer,
  onGotIt,
  onNeedPractice,
  onSelfGrade,
  showSelfGrade,
}: {
  evaluation: EvaluationResult | 'revealed' | null
  answer: string
  explanation?: string
  userAnswer?: string
  onGotIt: () => void
  onNeedPractice: () => void
  onSelfGrade?: (g: 'correct' | 'incorrect' | 'unsure') => void
  showSelfGrade?: boolean
}) {
  const status =
    evaluation === 'correct'
      ? { label: 'Correct', icon: CheckCircle2, className: 'text-green-700 dark:text-green-400' }
      : evaluation === 'close' || evaluation === 'revealed'
        ? {
            label: evaluation === 'revealed' ? 'Answer revealed' : 'Close — compare your answer',
            icon: CircleHelp,
            className: 'text-amber-700 dark:text-amber-400',
          }
        : {
            label: 'Incorrect',
            icon: XCircle,
            className: 'text-red-700 dark:text-red-400',
          }

  const Icon = status.icon

  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
      <div className={`flex items-center gap-2 text-sm font-semibold ${status.className}`}>
        <Icon className="h-5 w-5" aria-hidden />
        <span>{status.label}</span>
      </div>

      <div>
        <p className="mb-1 text-xs font-semibold tracking-wide text-slate-500 uppercase">
          Correct answer
        </p>
        <CodeBlock code={answer} />
      </div>

      {userAnswer ? (
        <div>
          <p className="mb-1 text-xs font-semibold tracking-wide text-slate-500 uppercase">
            Your answer
          </p>
          <CodeBlock code={userAnswer} />
        </div>
      ) : null}

      {explanation ? (
        <div>
          <p className="mb-1 text-xs font-semibold tracking-wide text-slate-500 uppercase">
            Memory hook
          </p>
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{explanation}</p>
        </div>
      ) : null}

      {showSelfGrade && onSelfGrade ? (
        <div className="grid grid-cols-3 gap-2">
          <SecondaryButton onClick={() => onSelfGrade('correct')}>I knew it</SecondaryButton>
          <SecondaryButton onClick={() => onSelfGrade('unsure')}>Unsure</SecondaryButton>
          <SecondaryButton onClick={() => onSelfGrade('incorrect')}>Wrong</SecondaryButton>
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-2">
        <PrimaryButton onClick={onGotIt}>Got it</PrimaryButton>
        <SecondaryButton onClick={onNeedPractice}>Need practice</SecondaryButton>
      </div>
    </div>
  )
}
