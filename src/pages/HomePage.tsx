import { Link } from 'react-router-dom'
import { questions } from '../data/questions'
import { useStudy } from '../hooks/useStudyStore'
import {
  categoryMastery,
  computeOverallMastery,
  computeStreak,
  dueCount,
  weakestCategory,
} from '../services/progress'
import { Card, PageHeader } from '../components/ui'
import { ProgressBar } from '../components/ProgressBar'

export function HomePage() {
  const { store } = useStudy()
  const due = dueCount(questions, store.questionStats)
  const overall = computeOverallMastery(questions, store.questionStats)
  const streak = computeStreak(store.studyDays)
  const weakest = weakestCategory(questions, store.questionStats)
  const categories = categoryMastery(questions, store.questionStats)

  return (
    <div>
      <PageHeader title="PL-400 Syntax Trainer" subtitle="Exam syntax practice · active recall" />

      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Today's review" value={`${due} due`} />
        <Stat label="Overall" value={`${Math.round(overall * 100)}%`} />
        <Stat label="Streak" value={`${streak.current} days`} />
        <Stat
          label="Weakest"
          value={weakest ? `${Math.round(weakest.mastery * 100)}%` : '—'}
          hint={weakest?.category}
        />
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <Link
          to="/practice?mode=quick10"
          className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-teal-700 px-4 text-sm font-semibold text-white transition hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-500"
        >
          Practice
        </Link>
        <Link
          to="/scratchpad"
          className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
        >
          Syntax Scratchpad
        </Link>
      </div>

      <Card className="mb-4">
        <h2 className="mb-3 text-sm font-semibold tracking-wide text-slate-500 uppercase">
          Quick start
        </h2>
        <div className="grid grid-cols-3 gap-2">
          <Link
            to="/practice?mode=quick10"
            className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            10 Questions
          </Link>
          <Link
            to="/practice?mode=weak"
            className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            Weak Areas
          </Link>
          <Link
            to="/mistakes"
            className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            Mistakes
          </Link>
        </div>
      </Card>

      <Card>
        <h2 className="mb-3 text-sm font-semibold tracking-wide text-slate-500 uppercase">
          Categories
        </h2>
        <ul className="space-y-3">
          {categories.map((c) => (
            <li key={c.category}>
              <Link
                to={`/practice?mode=category&category=${encodeURIComponent(c.category)}`}
                className="block"
              >
                <ProgressBar value={c.mastery} label={c.category} />
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-3 dark:border-slate-800 dark:bg-slate-900/80">
      <p className="text-[11px] font-medium tracking-wide text-slate-500 uppercase">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-50">{value}</p>
      {hint ? <p className="truncate text-xs text-slate-500">{hint}</p> : null}
    </div>
  )
}
