import type { ActivityEvent } from '../types'
import { GitCommit, GitPullRequest, GitMerge, CircleDot, MessageSquare, Eye, AlertCircle, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

const typeConfig: Record<ActivityEvent['type'], { icon: typeof GitCommit; color: string }> = {
  commit: { icon: GitCommit, color: 'text-green-500' },
  pr_opened: { icon: GitPullRequest, color: 'text-blue-400' },
  pr_merged: { icon: GitMerge, color: 'text-purple-400' },
  issue_assigned: { icon: CircleDot, color: 'text-cyan-400' },
  comment: { icon: MessageSquare, color: 'text-zinc-400' },
  review: { icon: Eye, color: 'text-yellow-400' },
  error: { icon: AlertCircle, color: 'text-red-500' },
  status_change: { icon: RefreshCw, color: 'text-blue-400' },
}

export function ActivityItem({ event }: { event: ActivityEvent }) {
  const config = typeConfig[event.type]
  const Icon = config.icon
  const time = new Date(event.timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
  const date = new Date(event.timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })

  return (
    <div className="flex gap-3 px-4 py-3">
      <div className="flex flex-col items-center">
        <div className={cn('flex h-8 w-8 items-center justify-center rounded-full bg-accent', config.color)}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="mt-2 h-full w-px bg-border" />
      </div>
      <div className="flex-1 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">{event.agent}</span>
          <span className="text-xs text-muted-foreground">{date} at {time}</span>
        </div>
        <p className="mt-0.5 text-sm text-muted-foreground">{event.message}</p>
      </div>
    </div>
  )
}
