export function ProgressBar({
  value,
  label,
  tone = 'accent',
}: {
  value: number
  label?: string
  tone?: 'accent' | 'ok' | 'warn' | 'bad'
}) {
  const pct = Math.max(0, Math.min(100, Math.round(value * 100)))
  const colors = {
    accent: 'bg-teal-600',
    ok: 'bg-green-600',
    warn: 'bg-amber-600',
    bad: 'bg-red-600',
  }
  return (
    <div className="w-full">
      {label ? (
        <div className="mb-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>{label}</span>
          <span aria-hidden>{pct}%</span>
        </div>
      ) : null}
      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? 'Progress'}
      >
        <div className={`h-full rounded-full ${colors[tone]}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
