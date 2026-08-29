import { useMemo, useState } from 'react'
import { CodeBlock } from '../components/CodeBlock'
import { Card, PageHeader, PrimaryButton, SecondaryButton } from '../components/ui'
import { questions } from '../data/questions'
import { useStudy } from '../hooks/useStudyStore'
import { evaluateAnswer } from '../services/answerEvaluator'
import { emptyStats, applyOutcome } from '../services/questionScheduler'
import {
  buildScratchpadDrills,
  pickNextDrill,
  type ScratchpadDrill,
} from '../services/scratchpadDrills'
import type { EvaluationResult } from '../types/question'

const INSERTS = ['(', ')', '{', '}', "'", '"', '.', ',', ';']

export function ScratchpadPage() {
  const drills = useMemo(() => buildScratchpadDrills(questions), [])
  const { store, setQuestionStats, markStudiedToday } = useStudy()
  const [drill, setDrill] = useState<ScratchpadDrill | undefined>(() => drills[0])
  const [code, setCode] = useState('')
  const [result, setResult] = useState<EvaluationResult | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [showHint, setShowHint] = useState(false)

  if (!drill) {
    return (
      <div>
        <PageHeader title="Syntax Scratchpad" subtitle="No code-shaped drills available." />
      </div>
    )
  }

  const question = questions.find((q) => q.id === drill.id)!

  const check = () => {
    const ev = evaluateAnswer(code, question)
    setResult(ev)
    setRevealed(true)
    const prev = store.questionStats[drill.id] ?? emptyStats()
    const outcome = ev === 'correct' ? 'correct' : ev === 'close' ? 'unsure' : 'incorrect'
    setQuestionStats(drill.id, applyOutcome(prev, outcome))
    markStudiedToday()
  }

  const reveal = () => {
    setRevealed(true)
    setResult('close')
  }

  const reset = () => {
    setCode('')
    setResult(null)
    setRevealed(false)
    setShowHint(false)
  }

  const next = () => {
    const n = pickNextDrill(drills, drill.id)
    if (n) {
      setDrill(n)
      reset()
    }
  }

  const needPractice = () => {
    const prev = store.questionStats[drill.id] ?? emptyStats()
    setQuestionStats(drill.id, { ...prev, needsPractice: true })
  }

  const insert = (ch: string) => {
    setCode((c) => `${c}${ch}`)
  }

  return (
    <div>
      <PageHeader
        title="Syntax Scratchpad"
        subtitle="Muscle memory — no runtime, just syntax."
      />

      <Card className="mb-3">
        <p className="mb-1 text-xs font-semibold tracking-wide text-slate-500 uppercase">
          {drill.id} · {drill.topic}
        </p>
        <p className="text-base leading-relaxed">{drill.prompt}</p>
        {drill.hint ? (
          <button
            type="button"
            className="mt-2 text-sm text-teal-700 underline dark:text-teal-300"
            onClick={() => setShowHint((v) => !v)}
          >
            {showHint ? 'Hide hint' : 'Show hint'}
          </button>
        ) : null}
        {showHint && drill.hint ? (
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{drill.hint}</p>
        ) : null}
      </Card>

      <label htmlFor="scratch" className="sr-only">
        Scratchpad editor
      </label>
      <textarea
        id="scratch"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        rows={10}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        className="mb-2 w-full rounded-xl border border-slate-300 bg-white p-3 font-mono text-base leading-relaxed text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
        placeholder="Write the syntax here…"
      />

      <div className="mb-3 flex flex-wrap gap-1">
        {INSERTS.map((ch) => (
          <button
            key={ch}
            type="button"
            onClick={() => insert(ch)}
            className="min-h-11 min-w-11 rounded-lg border border-slate-300 bg-white font-mono text-sm dark:border-slate-700 dark:bg-slate-900"
            aria-label={`Insert ${ch}`}
          >
            {ch}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setCode((c) => `${c}  `)}
          className="min-h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
        >
          Indent
        </button>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2">
        <PrimaryButton onClick={check}>Check Answer</PrimaryButton>
        <SecondaryButton onClick={reveal}>Reveal Answer</SecondaryButton>
        <SecondaryButton onClick={reset}>Reset</SecondaryButton>
        <SecondaryButton onClick={next}>Next Exercise</SecondaryButton>
      </div>

      <SecondaryButton className="mb-4" onClick={needPractice}>
        Mark Need Practice
      </SecondaryButton>

      {revealed ? (
        <Card className="space-y-3">
          {result ? (
            <p className="text-sm font-semibold">
              {result === 'correct'
                ? 'Correct'
                : result === 'close'
                  ? 'Close — compare your answer'
                  : 'Incorrect'}
            </p>
          ) : null}
          <div>
            <p className="mb-1 text-xs font-semibold text-slate-500 uppercase">Canonical</p>
            <CodeBlock code={drill.expected} />
            <button
              type="button"
              className="mt-2 text-sm text-teal-700 underline dark:text-teal-300"
              onClick={() => navigator.clipboard?.writeText(drill.expected)}
            >
              Copy canonical answer
            </button>
          </div>
        </Card>
      ) : null}
    </div>
  )
}
