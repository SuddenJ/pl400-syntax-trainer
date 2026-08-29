import { Link } from 'react-router-dom'
import { Card, PageHeader } from '../components/ui'
import { BookMarked, Settings, AlertTriangle } from 'lucide-react'

export function MorePage() {
  return (
    <div>
      <PageHeader title="More" subtitle="Reference and settings" />
      <div className="space-y-3">
        <LinkCard to="/mistakes" icon={AlertTriangle} title="Mistakes" desc="Review wrong and unsure items" />
        <LinkCard to="/questions" icon={BookMarked} title="Question browser" desc="Search the full bank" />
        <LinkCard to="/settings" icon={Settings} title="Settings" desc="Theme, export, reset" />
      </div>
    </div>
  )
}

function LinkCard({
  to,
  icon: Icon,
  title,
  desc,
}: {
  to: string
  icon: typeof Settings
  title: string
  desc: string
}) {
  return (
    <Link to={to}>
      <Card className="flex items-center gap-3 transition hover:border-teal-600/40">
        <Icon className="h-6 w-6 text-teal-700 dark:text-teal-300" aria-hidden />
        <div>
          <p className="font-semibold">{title}</p>
          <p className="text-sm text-slate-500">{desc}</p>
        </div>
      </Card>
    </Link>
  )
}
