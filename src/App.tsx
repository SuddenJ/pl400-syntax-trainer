import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { BottomNav } from './components/BottomNav'
import { AppShell } from './components/ui'
import { StudyProvider } from './hooks/useStudyStore'
import { HomePage } from './pages/HomePage'
import { MistakesPage } from './pages/MistakesPage'
import { MorePage } from './pages/MorePage'
import { PracticePage } from './pages/PracticePage'
import { ProgressPage } from './pages/ProgressPage'
import { QuestionBrowserPage } from './pages/QuestionBrowserPage'
import { ScratchpadPage } from './pages/ScratchpadPage'
import { SettingsPage } from './pages/SettingsPage'
import { questionBankMeta, questions } from './data/questions'

function BankGate({ children }: { children: React.ReactNode }) {
  if (!questions?.length) {
    return (
      <div className="mx-auto max-w-lg p-6">
        <h1 className="text-xl font-semibold text-red-700">Question bank failed to load.</h1>
        <p className="mt-2 text-sm text-slate-600">
          Run <code className="font-mono">npm run question-bank:build</code> and rebuild the app.
        </p>
      </div>
    )
  }
  return children
}

export default function App() {
  return (
    <StudyProvider>
      <HashRouter>
        <BankGate>
          <AppShell>
            <p className="sr-only">
              Loaded {questionBankMeta.count} questions from {questionBankMeta.source}
            </p>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/practice" element={<PracticePage />} />
              <Route path="/scratchpad" element={<ScratchpadPage />} />
              <Route path="/mistakes" element={<MistakesPage />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/questions" element={<QuestionBrowserPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/more" element={<MorePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppShell>
          <BottomNav />
        </BankGate>
      </HashRouter>
    </StudyProvider>
  )
}
