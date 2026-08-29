import { Card, PageHeader } from '../components/ui'
import { ProgressBar } from '../components/ProgressBar'
import { questions } from '../data/questions'
import { useStudy } from '../hooks/useStudyStore'
import {
  categoryMastery,
  computeOverallMastery,
  computeStreak,
  countByMastery,
  questionsCompletedToday,
} from '../services/progress'
import { toUiCategory } from '../utils/categories'
import { getStats } from '../services/progress'

export function ProgressPage() {
  const { store } = useStudy()
  const counts = countByMastery(questions, store.questionStats)
  const overall = computeOverallMastery(questions, store.questionStats)
  const streak = computeStreak(store.studyDays)
  const todayCount = questionsCompletedToday(store.questionStats)
  const categories = categoryMastery(questions, store.questionStats)

  let totalAttempts = 0
  let totalCorrect = 0
  for (const s of Object.values(store.questionStats)) {
    totalAttempts += s.attempts
    totalCorrect += s.correct
  }
  const accuracy = totalAttempts ? totalCorrect / totalAttempts : 0

  const topicScores = new Map<string, { correct: number; attempts: number; category: string }>()
  for (const q of questions) {
    const s = getStats(store.questionStats, q.id)
    if (s.attempts === 0) continue
    const row = topicScores.get(q.topic) ?? { correct: 0, attempts: 0, category: q.category }
    row.correct += s.correct
    row.attempts += s.attempts
    topicScores.set(q.topic, row)
  }
  const weakTopics = [...topicScores.entries()]
    .map(([topic, row]) => ({
      topic,
      accuracy: row.correct / row.attempts,
      category: toUiCategory(row.category),
    }))
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 8)

  return (
    <div>
      <PageHeader title="Progress" subtitle="Motivation and prioritization — not a science fair." />

      <div className="mb-4 grid grid-cols-2 gap-3">
        <Stat label="Attempted" value={String(counts.attempted)} />
        <Stat label="Accuracy" value={`${Math.round(accuracy * 100)}%`} />
        <Stat label="Mastered" value={String(counts.mastered)} />
        <Stat label="Learning" value={String(counts.learning + counts.familiar)} />
        <Stat label="Not attempted" value={String(counts.new)} />
        <Stat label="Today" value={String(todayCount)} />
        <Stat label="Streak" value={`${streak.current}d`} />
        <Stat label="Best streak" value={`${streak.best}d`} />
      </div>

      <Card className="mb-4">
        <ProgressBar value={overall} label="Overall mastery" />
      </Card>

      <Card className="mb-4">
        <h2 className="mb-3 text-sm font-semibold text-slate-500 uppercase">Category mastery</h2>
        <ul className="space-y-3">
          {categories.map((c) => (
            <li key={c.category}>
              <ProgressBar value={c.mastery} label={c.category} />
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <h2 className="mb-3 text-sm font-semibold text-slate-500 uppercase">Weakest topics</h2>
        {weakTopics.length === 0 ? (
          <p className="text-sm text-slate-500">Practice a few questions to unlock topic stats.</p>
        ) : (
          <ul className="space-y-2">
            {weakTopics.map((t) => (
              <li key={t.topic} className="flex items-center justify-between gap-2 text-sm">
                <span>
                  <span className="font-medium">{t.topic}</span>
                  <span className="text-slate-500"> · {t.category}</span>
                </span>
                <span className="font-mono text-xs">{Math.round(t.accuracy * 100)}%</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-3 dark:border-slate-800 dark:bg-slate-900/80">
      <p className="text-[11px] font-medium tracking-wide text-slate-500 uppercase">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
    </div>
  )
}
