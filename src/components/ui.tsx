import type { ReactNode } from 'react'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto min-h-dvh w-full max-w-3xl px-4 pb-24 pt-4 sm:px-6">
      {children}
    </div>
  )
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: string
  action?: ReactNode
}) {
  return (
    <header className="mb-5 flex items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </header>
  )
}

export function Card({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={`rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 ${className}`}
    >
      {children}
    </section>
  )
}

export function PrimaryButton({
  children,
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-teal-700 px-4 text-sm font-semibold text-white transition hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-teal-600 dark:hover:bg-teal-500 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function SecondaryButton({
  children,
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
