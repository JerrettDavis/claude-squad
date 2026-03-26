import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  triageHistory, routingRules, moduleOwnership, agentCapabilities,
} from '@/data/workflow-mock'
import {
  Target, ArrowRight, FolderTree, Bot, Zap, CheckCircle,
  Clock, AlertCircle, BarChart3, Shield,
} from 'lucide-react'

function getTimeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime()
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return 'just now'
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

const confidenceColors = {
  high: 'text-green-400 border-green-500/20 bg-green-500/10',
  medium: 'text-yellow-400 border-yellow-500/20 bg-yellow-500/10',
  low: 'text-red-400 border-red-500/20 bg-red-500/10',
}

const statusIcons = {
  assigned: CheckCircle,
  pending: Clock,
  rejected: AlertCircle,
  escalated: AlertCircle,
}

export function TriagePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Ralph Triage</h2>
        <p className="text-sm text-muted-foreground">
          Watch → Classify → Match → Assign → Monitor
        </p>
      </div>

      {/* Triage pipeline visualization */}
      <div className="flex items-center gap-2">
        {['Watch', 'Classify', 'Match', 'Assign', 'Monitor'].map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2">
              <div className={`h-2 w-2 rounded-full ${i < 4 ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`} />
              <span className="text-sm font-medium text-foreground">{step}</span>
            </div>
            {i < 4 && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
          </div>
        ))}
      </div>

      <Tabs defaultValue="history">
        <TabsList>
          <TabsTrigger value="history">Triage History</TabsTrigger>
          <TabsTrigger value="routing">Routing Rules</TabsTrigger>
          <TabsTrigger value="ownership">Module Ownership</TabsTrigger>
          <TabsTrigger value="capabilities">Agent Capabilities</TabsTrigger>
        </TabsList>

        <TabsContent value="history">
          <Card>
            <CardHeader className="pb-0">
              <CardTitle className="text-sm font-semibold">Recent Triage Decisions</CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-2">
              {triageHistory.map((entry) => {
                const StatusIcon = statusIcons[entry.status]
                return (
                  <div key={entry.id} className="flex items-start gap-3 border-b border-border px-4 py-3">
                    <Target className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">
                          #{entry.issueNumber}: {entry.issueTitle}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className={confidenceColors[entry.triageResult.confidence]}>
                          {entry.triageResult.confidence} confidence
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          {entry.triageResult.source}
                        </Badge>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <ArrowRight className="h-3 w-3" />
                          <Bot className="h-3 w-3" /> {entry.triageResult.agent}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <StatusIcon className="h-3 w-3" /> {entry.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{entry.triageResult.reason}</p>
                      <p className="text-xs text-muted-foreground">{getTimeAgo(entry.timestamp)}</p>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="routing">
          <Card>
            <CardHeader className="pb-0">
              <CardTitle className="text-sm font-semibold">Work Type → Agent Routing</CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-2">
              {routingRules.map((rule, i) => (
                <div key={i} className="flex items-center gap-3 border-b border-border px-4 py-3">
                  <Zap className="h-4 w-4 text-yellow-400 shrink-0" />
                  <span className="text-sm font-medium text-foreground w-32">{rule.workType}</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <span className="flex items-center gap-1 text-sm text-foreground">
                    <Bot className="h-3.5 w-3.5" /> {rule.agentName}
                  </span>
                  <div className="ml-auto flex gap-1">
                    {rule.keywords.map((kw) => (
                      <Badge key={kw} variant="outline" className="text-[10px] px-1.5 py-0">{kw}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ownership">
          <Card>
            <CardHeader className="pb-0">
              <CardTitle className="text-sm font-semibold">Module → Owner Mapping</CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-2">
              {moduleOwnership.map((mod, i) => (
                <div key={i} className="flex items-center gap-3 border-b border-border px-4 py-3">
                  <FolderTree className="h-4 w-4 text-blue-400 shrink-0" />
                  <span className="font-mono text-sm text-foreground w-48">{mod.modulePath}</span>
                  <span className="flex items-center gap-1 text-sm text-foreground">
                    <Shield className="h-3 w-3 text-green-500" /> {mod.primary}
                  </span>
                  {mod.secondary && (
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      / {mod.secondary}
                    </span>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="capabilities">
          <div className="grid grid-cols-2 gap-4">
            {agentCapabilities.map((agent) => (
              <Card key={agent.agent}>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Bot className="h-4 w-4" />
                    <span className="text-sm font-semibold text-foreground">{agent.agent}</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>Workload</span>
                        <span>{agent.workload}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-accent">
                        <div
                          className={`h-full rounded-full ${
                            agent.workload > 75 ? 'bg-red-500' : agent.workload > 50 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${agent.workload}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <BarChart3 className="h-3 w-3" /> Success Rate
                      </span>
                      <span className="text-foreground">{agent.successRate}%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Zap className="h-3 w-3" /> Tokens Remaining
                      </span>
                      <span className="text-foreground">{agent.tokensRemaining.toLocaleString()}</span>
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {agent.capabilities.map((cap) => (
                        <Badge key={cap} variant="outline" className="text-[10px] px-1.5 py-0">{cap}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
