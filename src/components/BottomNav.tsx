import { NavLink } from 'react-router-dom'
import { BookOpen, Code2, Home, MoreHorizontal, TrendingUp } from 'lucide-react'

const items = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/practice', label: 'Practice', icon: BookOpen },
  { to: '/scratchpad', label: 'Scratchpad', icon: Code2 },
  { to: '/progress', label: 'Progress', icon: TrendingUp },
  { to: '/more', label: 'More', icon: MoreHorizontal },
]

export function BottomNav() {
  return (
    <nav
      aria-label="Primary"
      className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/80 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95"
    >
      <ul className="mx-auto grid max-w-3xl grid-cols-5 gap-1 px-1 pt-1">
        {items.map(({ to, label, icon: Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                [
                  'flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-lg px-1 text-[11px] font-medium',
                  isActive
                    ? 'text-teal-700 dark:text-teal-300'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200',
                ].join(' ')
              }
            >
              <Icon className="h-5 w-5" aria-hidden />
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
