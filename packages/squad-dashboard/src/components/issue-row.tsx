import type { Issue } from '../types'
import { Badge } from '@/components/ui/badge'
import { CircleDot, CircleCheck, MessageSquare, Bot } from 'lucide-react'

const labelColors: Record<string, string> = {
  bug: 'bg-red-500/15 text-red-400 border-red-500/20',
  feature: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  ci: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
  dashboard: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  sdk: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
  infra: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
}

export function IssueRow({ issue }: { issue: Issue }) {
  const Icon = issue.state === 'open' ? CircleDot : CircleCheck
  const iconColor = issue.state === 'open' ? 'text-green-500' : 'text-purple-400'
  const timeAgo = getTimeAgo(issue.updatedAt)

  return (
    <div className="flex items-start gap-3 border-b border-border px-4 py-3 transition-colors hover:bg-accent/30">
      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${iconColor}`} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground hover:text-primary cursor-pointer">
            {issue.title}
          </span>
          {issue.labels.map((label) => (
            <Badge
              key={label}
              variant="outline"
              className={`text-[10px] px-1.5 py-0 ${labelColors[label] ?? ''}`}
            >
              {label}
            </Badge>
          ))}
        </div>
        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
          <span>#{issue.number}</span>
          <span>opened by {issue.author}</span>
          <span>updated {timeAgo}</span>
          {issue.commentCount > 0 && (
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" /> {issue.commentCount}
            </span>
          )}
          {issue.assignedAgent && (
            <span className="flex items-center gap-1 text-primary/70">
              <Bot className="h-3 w-3" /> {issue.assignedAgent}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function getTimeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime()
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return 'just now'
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}
