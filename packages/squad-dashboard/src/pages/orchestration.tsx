import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { orchestrationLog } from '@/data/workflow-mock'
import {
  Target, UserCheck, AlertTriangle, CheckCircle2, AlertCircle,
  RefreshCw, Users, Clock,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const typeConfig = {
  triage: { icon: Target, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  assignment: { icon: UserCheck, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  escalation: { icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  completion: { icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10' },
  error: { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
  status: { icon: RefreshCw, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  cast: { icon: Users, color: 'text-orange-400', bg: 'bg-orange-500/10' },
}

export function OrchestrationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Orchestration Log</h2>
        <p className="text-sm text-muted-foreground">
          Audit trail of all squad orchestration events
        </p>
      </div>

      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-sm font-semibold">Events</CardTitle>
        </CardHeader>
        <CardContent className="p-0 pt-2">
          {orchestrationLog.map((event, i) => {
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
              <div key={event.id} className="flex gap-3 px-4 py-3">
                <div className="flex flex-col items-center">
                  <div className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full',
                    config.bg, config.color,
                  )}>
                    <Icon className="h-4 w-4" />
                  </div>
                  {i < orchestrationLog.length - 1 && (
                    <div className="mt-2 h-full w-px bg-border" />
                  )}
                </div>
                <div className="flex-1 pb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`text-[10px] ${config.color}`}>
                      {event.type}
                    </Badge>
                    <span className="text-sm font-medium text-foreground">{event.agent}</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" /> {date} {time}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{event.message}</p>
                  {event.details && (
                    <p className="mt-0.5 text-xs text-muted-foreground/70 italic">{event.details}</p>
                  )}
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
