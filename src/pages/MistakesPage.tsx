import { Link } from 'react-router-dom'
import { Card, PageHeader, PrimaryButton, SecondaryButton } from '../components/ui'
import { questions } from '../data/questions'
import { useStudy } from '../hooks/useStudyStore'
import { getStats, mistakeQuestions } from '../services/progress'
import { toUiCategory } from '../utils/categories'
import { formatRelativeDay } from '../utils/dates'

export function MistakesPage() {
  const { store } = useStudy()
  const mistakes = mistakeQuestions(questions, store.questionStats)

  return (
    <div>
      <PageHeader
        title="Mistakes"
        subtitle="Wrong, unsure, and marked for practice."
      />

      <div className="mb-4 grid gap-2 sm:grid-cols-2">
        <Link to="/practice?mode=mistakes">
          <PrimaryButton>Practice all mistakes</PrimaryButton>
        </Link>
        <Link to="/practice?mode=weak">
          <SecondaryButton>Weak areas</SecondaryButton>
        </Link>
      </div>

      {mistakes.length === 0 ? (
        <Card>
          <p className="text-sm text-slate-500">No mistakes logged yet. Start a practice session.</p>
        </Card>
      ) : (
        <ul className="space-y-3">
          {mistakes.map((q) => {
            const s = getStats(store.questionStats, q.id)
            const accuracy = s.attempts ? Math.round((s.correct / s.attempts) * 100) : 0
            return (
              <li key={q.id}>
                <Card>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-mono text-xs text-teal-700 dark:text-teal-300">{q.id}</p>
                      <p className="mt-1 font-medium">{q.topic}</p>
                      <p className="text-xs text-slate-500">{toUiCategory(q.category)}</p>
                    </div>
                    <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-200">
                      {s.masteryLabel}
                    </span>
                  </div>
                  <dl className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <div>
                      <dt className="text-xs text-slate-500">Attempts</dt>
                      <dd>{s.attempts}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-500">Correct</dt>
                      <dd>{s.correct}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-500">Accuracy</dt>
                      <dd>{accuracy}%</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-500">Last answered</dt>
                      <dd>{formatRelativeDay(s.lastSeenAt)}</dd>
                    </div>
                  </dl>
                  <Link
                    to={`/practice?mode=mistakes&category=${encodeURIComponent(toUiCategory(q.category))}`}
                    className="mt-3 inline-block text-sm text-teal-700 underline dark:text-teal-300"
                  >
                    Practice this category
                  </Link>
                </Card>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
