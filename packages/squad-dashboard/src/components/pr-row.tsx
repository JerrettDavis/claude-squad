import type { PullRequest } from '../types'
import { Badge } from '@/components/ui/badge'
import { GitPullRequest, GitMerge, Bot, MessageSquare, Plus, Minus, Check, X, Clock } from 'lucide-react'

const stateConfig = {
  open: { icon: GitPullRequest, color: 'text-green-500', label: 'Open' },
  draft: { icon: GitPullRequest, color: 'text-zinc-400', label: 'Draft' },
  merged: { icon: GitMerge, color: 'text-purple-400', label: 'Merged' },
  closed: { icon: GitPullRequest, color: 'text-red-400', label: 'Closed' },
}

const checkIcons = {
  passing: { icon: Check, color: 'text-green-500' },
  failing: { icon: X, color: 'text-red-500' },
  pending: { icon: Clock, color: 'text-yellow-500' },
  none: { icon: Clock, color: 'text-zinc-500' },
}

export function PrRow({ pr }: { pr: PullRequest }) {
  const state = stateConfig[pr.state]
  const StateIcon = state.icon
  const check = checkIcons[pr.checks]
  const CheckIcon = check.icon
  const timeAgo = getTimeAgo(pr.updatedAt)

  return (
    <div className="flex items-start gap-3 border-b border-border px-4 py-3 transition-colors hover:bg-accent/30">
      <StateIcon className={`mt-0.5 h-4 w-4 shrink-0 ${state.color}`} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground hover:text-primary cursor-pointer">
            {pr.title}
          </span>
          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
            {state.label}
          </Badge>
        </div>
        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
          <span>#{pr.number}</span>
          <span>{pr.branch} → {pr.baseBranch}</span>
          <span className="flex items-center gap-1">
            <Plus className="h-3 w-3 text-green-500" />{pr.additions}
            <Minus className="h-3 w-3 text-red-400" />{pr.deletions}
          </span>
          <span className={`flex items-center gap-1 ${check.color}`}>
            <CheckIcon className="h-3 w-3" /> checks
          </span>
          {pr.commentCount > 0 && (
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" /> {pr.commentCount}
            </span>
          )}
          {pr.agent && (
            <span className="flex items-center gap-1 text-primary/70">
              <Bot className="h-3 w-3" /> {pr.agent}
            </span>
          )}
          <span>updated {timeAgo}</span>
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
