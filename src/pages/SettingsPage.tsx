import { useRef, useState, type ReactNode } from 'react'
import { Card, PageHeader, PrimaryButton, SecondaryButton } from '../components/ui'
import { useStudy } from '../hooks/useStudyStore'
import type { PracticePreference, ThemeMode } from '../types/question'

export function SettingsPage() {
  const { settings, updateSettings, resetAll, exportJson, importJson } = useStudy()
  const fileRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState<string | null>(null)

  const onExport = () => {
    const blob = new Blob([exportJson()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pl400-progress-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    setMessage('Progress exported.')
  }

  const onImportFile = async (file: File) => {
    try {
      const text = await file.text()
      importJson(text)
      setMessage('Progress imported.')
    } catch {
      setMessage('Import failed — invalid JSON.')
    }
  }

  const onReset = () => {
    const ok = window.confirm('Reset all study data? This cannot be undone.')
    if (!ok) return
    resetAll()
    setMessage('Study data reset.')
  }

  return (
    <div>
      <PageHeader title="Settings" subtitle="Local-only progress · no accounts." />

      {message ? (
        <p className="mb-3 rounded-xl bg-teal-50 px-3 py-2 text-sm text-teal-900 dark:bg-teal-950 dark:text-teal-100" role="status">
          {message}
        </p>
      ) : null}

      <Card className="mb-4 space-y-3">
        <Field label="Theme">
          <select
            className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 dark:border-slate-700 dark:bg-slate-950"
            value={settings.theme}
            onChange={(e) => updateSettings({ theme: e.target.value as ThemeMode })}
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </Field>

        <Field label="Default session size">
          <select
            className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 dark:border-slate-700 dark:bg-slate-950"
            value={settings.defaultSessionSize}
            onChange={(e) =>
              updateSettings({ defaultSessionSize: Number(e.target.value) as 10 | 20 | 50 })
            }
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </Field>

        <Field label="Practice preference">
          <select
            className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 dark:border-slate-700 dark:bg-slate-950"
            value={settings.practicePreference}
            onChange={(e) =>
              updateSettings({ practicePreference: e.target.value as PracticePreference })
            }
          >
            <option value="mixed">Mixed</option>
            <option value="typing">More typing</option>
            <option value="reveal">More reveal / self-grade</option>
          </select>
        </Field>
      </Card>

      <Card className="space-y-2">
        <PrimaryButton onClick={onExport}>Export progress JSON</PrimaryButton>
        <SecondaryButton onClick={() => fileRef.current?.click()}>Import progress JSON</SecondaryButton>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) void onImportFile(f)
          }}
        />
        <SecondaryButton onClick={onReset} className="border-red-300 text-red-700 dark:border-red-800 dark:text-red-300">
          Reset study data
        </SecondaryButton>
      </Card>
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-slate-600 dark:text-slate-300">{label}</span>
      {children}
    </label>
  )
}
