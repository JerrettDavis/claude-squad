import type { Agent } from '../types'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Bot, Zap, Clock, Hash } from 'lucide-react'
import { cn } from '@/lib/utils'

const statusConfig = {
  active: { color: 'bg-green-500', label: 'Active', badgeVariant: 'default' as const },
  idle: { color: 'bg-yellow-500', label: 'Idle', badgeVariant: 'secondary' as const },
  error: { color: 'bg-red-500', label: 'Error', badgeVariant: 'destructive' as const },
  offline: { color: 'bg-zinc-500', label: 'Offline', badgeVariant: 'outline' as const },
}

export function AgentCard({ agent }: { agent: Agent }) {
  const status = statusConfig[agent.status]

  return (
    <Card className="transition-all hover:border-foreground/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
              <Bot className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">{agent.name}</h3>
              <p className="text-xs text-muted-foreground">{agent.model}</p>
            </div>
          </div>
          <Badge variant={status.badgeVariant} className="gap-1.5">
            <span className={cn('h-1.5 w-1.5 rounded-full', status.color)} />
            {status.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {agent.currentTask && (
          <div className="rounded-md bg-accent/50 px-3 py-2">
            <p className="text-xs text-muted-foreground">Current task</p>
            <p className="text-sm text-foreground">{agent.currentTask}</p>
            {(agent.issueRef || agent.prRef) && (
              <p className="mt-1 text-xs text-muted-foreground">
                <Hash className="mr-0.5 inline h-3 w-3" />
                {agent.issueRef || agent.prRef}
              </p>
            )}
          </div>
        )}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> {agent.uptime}
          </span>
          <span className="flex items-center gap-1">
            <Zap className="h-3 w-3" /> {agent.tokensUsed.toLocaleString()} tokens
          </span>
        </div>
        <p className="text-xs text-muted-foreground">Last active: {agent.lastActivity}</p>
      </CardContent>
    </Card>
  )
}
