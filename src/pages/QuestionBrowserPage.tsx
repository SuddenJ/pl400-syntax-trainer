import { useMemo, useState } from 'react'
import { CodeBlock } from '../components/CodeBlock'
import { Card, PageHeader } from '../components/ui'
import { questionBankMeta, questions } from '../data/questions'
import { useStudy } from '../hooks/useStudyStore'
import { getStats } from '../services/progress'
import { toUiCategory, UI_CATEGORIES, uniqueTopics } from '../utils/categories'
import type { MasteryLabel, Origin } from '../types/question'

export function QuestionBrowserPage() {
  const { store } = useStudy()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<'All' | (typeof UI_CATEGORIES)[number]>('All')
  const [topic, setTopic] = useState('All')
  const [mastery, setMastery] = useState<'All' | MasteryLabel>('All')
  const [origin, setOrigin] = useState<'All' | Origin>('All')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const topics = useMemo(() => uniqueTopics(questions), [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return questions.filter((item) => {
      if (category !== 'All' && toUiCategory(item.category) !== category) return false
      if (topic !== 'All' && item.topic !== topic) return false
      if (origin !== 'All' && item.origin !== origin) return false
      const stats = getStats(store.questionStats, item.id)
      if (mastery !== 'All' && stats.masteryLabel !== mastery) return false
      if (!q) return true
      return (
        item.id.toLowerCase().includes(q) ||
        item.prompt.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.topic.toLowerCase().includes(q)
      )
    })
  }, [search, category, topic, mastery, origin, store.questionStats])

  const selected = selectedId ? questions.find((q) => q.id === selectedId) : undefined

  if (selected) {
    const stats = getStats(store.questionStats, selected.id)
    return (
      <div>
        <PageHeader
          title={selected.id}
          subtitle={selected.topic}
          action={
            <button type="button" className="text-sm underline" onClick={() => setSelectedId(null)}>
              Back
            </button>
          }
        />
        <Card className="mb-3 space-y-3">
          <p className="text-sm text-slate-500">
            {toUiCategory(selected.category)} · {selected.origin} · {stats.masteryLabel}
          </p>
          <p className="leading-relaxed">{selected.prompt}</p>
          <div>
            <p className="mb-1 text-xs font-semibold text-slate-500 uppercase">Answer</p>
            <CodeBlock code={selected.answer} />
          </div>
          {selected.explanation ? (
            <p className="text-sm text-slate-600 dark:text-slate-300">{selected.explanation}</p>
          ) : null}
          <dl className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <dt className="text-xs text-slate-500">Attempts</dt>
              <dd>{stats.attempts}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Correct</dt>
              <dd>{stats.correct}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Mastery</dt>
              <dd>{Math.round(stats.masteryScore * 100)}%</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Need practice</dt>
              <dd>{stats.needsPractice ? 'Yes' : 'No'}</dd>
            </div>
          </dl>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Question bank"
        subtitle={`${questionBankMeta.count} questions · search & filter`}
      />

      <div className="mb-3 space-y-2">
        <label htmlFor="qsearch" className="sr-only">
          Search questions
        </label>
        <input
          id="qsearch"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search ID, prompt, answer…"
          className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-base dark:border-slate-700 dark:bg-slate-950"
        />
        <div className="grid grid-cols-2 gap-2">
          <Select
            label="Category"
            value={category}
            onChange={(v) => setCategory(v as typeof category)}
            options={['All', ...UI_CATEGORIES]}
          />
          <Select
            label="Mastery"
            value={mastery}
            onChange={(v) => setMastery(v as typeof mastery)}
            options={['All', 'new', 'learning', 'familiar', 'strong', 'mastered']}
          />
          <Select
            label="Origin"
            value={origin}
            onChange={(v) => setOrigin(v as typeof origin)}
            options={['All', 'DOC', 'GAP']}
          />
          <Select
            label="Topic"
            value={topic}
            onChange={setTopic}
            options={['All', ...topics]}
          />
        </div>
      </div>

      <p className="mb-2 text-xs text-slate-500">{filtered.length} shown</p>
      <ul className="space-y-2">
        {filtered.slice(0, 200).map((q) => {
          const stats = getStats(store.questionStats, q.id)
          return (
            <li key={q.id}>
              <button
                type="button"
                onClick={() => setSelectedId(q.id)}
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-left dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-teal-700 dark:text-teal-300">{q.id}</span>
                  <span className="text-xs text-slate-500">
                    {stats.masteryLabel} — {Math.round(stats.masteryScore * 100)}%
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium">{q.topic}</p>
              </button>
            </li>
          )
        })}
      </ul>
      {filtered.length > 200 ? (
        <p className="mt-2 text-xs text-slate-500">Showing first 200. Refine filters to see more.</p>
      ) : null}
    </div>
  )
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: string[]
}) {
  const id = `sel-${label}`
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs text-slate-500">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-2 text-sm dark:border-slate-700 dark:bg-slate-950"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  )
}
