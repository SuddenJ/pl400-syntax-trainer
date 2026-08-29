export function localDateKey(date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function daysBetween(a: string, b: string): number {
  const ms = Date.parse(b) - Date.parse(a)
  return Math.floor(ms / (24 * 60 * 60 * 1000))
}

export function addDaysIso(iso: string, days: number): string {
  const d = new Date(iso)
  d.setDate(d.getDate() + days)
  return d.toISOString()
}

export function formatRelativeDay(iso?: string): string {
  if (!iso) return 'Never'
  const key = localDateKey(new Date(iso))
  const today = localDateKey()
  if (key === today) return 'Today'
  const yesterday = localDateKey(new Date(Date.now() - 86400000))
  if (key === yesterday) return 'Yesterday'
  return key
}
