import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { decisions } from '@/data/workflow-mock'
import {
  Inbox, CheckCircle, XCircle, Clock, AlertTriangle,
  GitMerge, Server, Swords, Star,
} from 'lucide-react'

function getTimeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime()
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return 'just now'
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

const typeIcons = {
  conflict: Swords,
  escalation: AlertTriangle,
  approval: GitMerge,
  resource: Server,
}

const statusConfig = {
  pending: { icon: Clock, color: 'text-yellow-400 border-yellow-500/20 bg-yellow-500/10' },
  approved: { icon: CheckCircle, color: 'text-green-400 border-green-500/20 bg-green-500/10' },
  rejected: { icon: XCircle, color: 'text-red-400 border-red-500/20 bg-red-500/10' },
  deferred: { icon: Clock, color: 'text-zinc-400 border-zinc-500/20 bg-zinc-500/10' },
}

export function DecisionsPage() {
  const pendingDecisions = decisions.filter((d) => d.status === 'pending')
  const resolvedDecisions = decisions.filter((d) => d.status !== 'pending')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Decision Inbox</h2>
          <p className="text-sm text-muted-foreground">
            {pendingDecisions.length} pending decisions requiring human input
          </p>
        </div>
        <Badge variant="outline" className="text-yellow-400 border-yellow-500/20 bg-yellow-500/10 gap-1">
          <Inbox className="h-3 w-3" /> {pendingDecisions.length} pending
        </Badge>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pendingDecisions.length})</TabsTrigger>
          <TabsTrigger value="resolved">Resolved ({resolvedDecisions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <div className="space-y-4">
            {pendingDecisions.map((decision) => {
              const TypeIcon = typeIcons[decision.type]
              return (
                <Card key={decision.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <TypeIcon className="h-4 w-4 text-muted-foreground" />
                        <CardTitle className="text-base">{decision.title}</CardTitle>
                      </div>
                      <Badge variant="outline" className={statusConfig[decision.status].color}>
                        {decision.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{decision.description}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>Requested by {decision.requestedBy}</span>
                      <span>{getTimeAgo(decision.timestamp)}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {decision.context && (
                      <div className="rounded-md bg-accent/50 px-3 py-2 text-xs text-muted-foreground">
                        {decision.context}
                      </div>
                    )}
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Options</p>
                      {decision.options.map((option, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 rounded-lg border border-border p-3 hover:border-foreground/20 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-foreground">{option.label}</span>
                              {option.recommended && (
                                <Badge variant="outline" className="text-[10px] gap-1 text-green-400 border-green-500/20">
                                  <Star className="h-2.5 w-2.5" /> recommended
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{option.description}</p>
                          </div>
                          <Button variant={option.recommended ? 'default' : 'outline'} size="sm">
                            Select
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="resolved">
          <div className="space-y-4">
            {resolvedDecisions.map((decision) => {
              const TypeIcon = typeIcons[decision.type]
              const StatusIcon = statusConfig[decision.status].icon
              return (
                <Card key={decision.id} className="opacity-75">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <TypeIcon className="h-4 w-4 text-muted-foreground" />
                        <CardTitle className="text-base">{decision.title}</CardTitle>
                      </div>
                      <Badge variant="outline" className={statusConfig[decision.status].color}>
                        <StatusIcon className="h-3 w-3 mr-1" /> {decision.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{decision.description}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>Requested by {decision.requestedBy}</span>
                      <span>{getTimeAgo(decision.timestamp)}</span>
                    </div>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
