import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { agentSessions } from '@/data/steering-mock'
import type { AgentSession } from '@/data/steering-mock'
import {
  Play, Pause, Square, RotateCcw, Bot, Terminal,
  Cpu, Zap, DollarSign, Clock, Hash,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const statusConfig = {
  running: { color: 'text-green-400 border-green-500/20 bg-green-500/10', dot: 'bg-green-500' },
  paused: { color: 'text-yellow-400 border-yellow-500/20 bg-yellow-500/10', dot: 'bg-yellow-500' },
  stopped: { color: 'text-zinc-400 border-zinc-500/20 bg-zinc-500/10', dot: 'bg-zinc-500' },
  error: { color: 'text-red-400 border-red-500/20 bg-red-500/10', dot: 'bg-red-500' },
}

const lineColors = {
  stdout: 'text-foreground',
  stderr: 'text-red-400',
  tool: 'text-cyan-400',
  thinking: 'text-purple-400 italic',
}

function SessionPanel({ session }: { session: AgentSession }) {
  const status = statusConfig[session.status]

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">{session.agent}</h3>
              <p className="text-xs text-muted-foreground">{session.model}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={status.color}>
              <span className={cn('mr-1.5 h-1.5 w-1.5 rounded-full', status.dot)} />
              {session.status}
            </Badge>
            <div className="flex gap-1">
              {session.status === 'running' && (
                <Button variant="ghost" size="icon" className="h-7 w-7" title="Pause">
                  <Pause className="h-3.5 w-3.5" />
                </Button>
              )}
              {session.status === 'paused' && (
                <Button variant="ghost" size="icon" className="h-7 w-7" title="Resume">
                  <Play className="h-3.5 w-3.5" />
                </Button>
              )}
              {(session.status === 'running' || session.status === 'paused') && (
                <Button variant="ghost" size="icon" className="h-7 w-7" title="Stop">
                  <Square className="h-3.5 w-3.5" />
                </Button>
              )}
              {session.status === 'stopped' && (
                <Button variant="ghost" size="icon" className="h-7 w-7" title="Restart">
                  <RotateCcw className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="rounded-md bg-accent/50 px-3 py-2">
          <p className="text-xs text-muted-foreground">Current task</p>
          <p className="text-sm text-foreground">{session.currentTask}</p>
        </div>

        <div className="grid grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Cpu className="h-3 w-3" />
            <span>{((session.tokensIn + session.tokensOut) / 1000).toFixed(0)}K tokens</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <DollarSign className="h-3 w-3" />
            <span>${session.costUsd.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Hash className="h-3 w-3" />
            <span>{session.requestCount} requests</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>PID {session.pid ?? '—'}</span>
          </div>
        </div>

        {/* Live output */}
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Output</span>
            {session.status === 'running' && (
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            )}
          </div>
          <ScrollArea className="h-32 rounded-md border border-border bg-background p-2">
            <div className="font-mono text-xs space-y-0.5">
              {session.outputLines.map((line, i) => {
                const time = new Date(line.timestamp).toLocaleTimeString('en-US', {
                  hour: '2-digit', minute: '2-digit', second: '2-digit',
                })
                return (
                  <div key={i} className="flex gap-2">
                    <span className="text-muted-foreground/50 shrink-0">{time}</span>
                    <span className={cn(lineColors[line.type])}>{line.content}</span>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  )
}

export function SteeringPage() {
  const running = agentSessions.filter((s) => s.status === 'running').length
  const totalCost = agentSessions.reduce((sum, s) => sum + s.costUsd, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Agent Steering</h2>
          <p className="text-sm text-muted-foreground">
            {running} running, {agentSessions.length - running} idle/stopped — ${totalCost.toFixed(2)} spent today
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Play className="h-3.5 w-3.5" /> Launch Agent
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {agentSessions.map((session) => (
          <SessionPanel key={session.id} session={session} />
        ))}
      </div>
    </div>
  )
}
