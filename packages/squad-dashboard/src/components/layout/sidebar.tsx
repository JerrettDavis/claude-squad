import { NavLink } from 'react-router-dom'
import {
  Bot, GitPullRequest, CircleDot, Activity, LayoutDashboard,
  GitBranch, History, FolderGit2, BookOpen, FolderKanban,
  Target, ScrollText, Inbox, Joystick, DollarSign, Settings, UserCog,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/theme-toggle'
import { useHealth } from '@/api/hooks'
import { USE_MOCKS } from '@/api/client'

const sections = [
  {
    label: 'Agents',
    items: [
      { to: '/', icon: LayoutDashboard, label: 'Overview' },
      { to: '/agents', icon: Bot, label: 'Agents' },
      { to: '/issues', icon: CircleDot, label: 'Issues' },
      { to: '/pulls', icon: GitPullRequest, label: 'Pull Requests' },
      { to: '/activity', icon: Activity, label: 'Activity' },
    ],
  },
  {
    label: 'Repository',
    items: [
      { to: '/repo', icon: FolderGit2, label: 'Repository' },
      { to: '/branches', icon: GitBranch, label: 'Branches' },
      { to: '/history', icon: History, label: 'History' },
    ],
  },
  {
    label: 'Knowledge',
    items: [
      { to: '/wiki', icon: BookOpen, label: 'Wiki' },
      { to: '/projects', icon: FolderKanban, label: 'Projects' },
    ],
  },
  {
    label: 'Workflows',
    items: [
      { to: '/triage', icon: Target, label: 'Ralph Triage' },
      { to: '/orchestration', icon: ScrollText, label: 'Orchestration Log' },
      { to: '/decisions', icon: Inbox, label: 'Decision Inbox' },
      { to: '/steering', icon: Joystick, label: 'Agent Steering' },
      { to: '/costs', icon: DollarSign, label: 'Cost Tracking' },
      { to: '/agent-config', icon: UserCog, label: 'Agent Config' },
      { to: '/settings', icon: Settings, label: 'Settings' },
    ],
  },
]

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const health = useHealth()
  const apiConnected = health.data?.ok === true
  const apiStatus = USE_MOCKS ? 'Mock data' : apiConnected ? 'API connected' : 'API offline'
  const dotColor = USE_MOCKS ? 'bg-yellow-500' : apiConnected ? 'bg-green-500' : 'bg-red-500'

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card flex flex-col">
      <div className="flex h-16 items-center gap-3 border-b border-border px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
          S
        </div>
        <div className="flex-1">
          <h1 className="text-sm font-semibold text-foreground">Squad Dashboard</h1>
          <p className="text-xs text-muted-foreground">@jerrettdavis/squad</p>
        </div>
        <ThemeToggle />
      </div>

      <nav className="flex-1 space-y-4 p-3 overflow-y-auto">
        {sections.map((section) => (
          <div key={section.label} className="space-y-1">
            <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {section.label}
            </p>
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="border-t border-border p-4 space-y-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className={cn('h-2 w-2 rounded-full', dotColor)} />
          <span>{apiStatus}</span>
        </div>
      </div>
    </aside>
  )
}
