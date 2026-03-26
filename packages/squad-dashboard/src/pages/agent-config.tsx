import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAgentConfigs } from '@/api/hooks'

export function AgentConfigPage() {
  const { data: agents = [] } = useAgentConfigs()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Agent Configuration</h2>
        <p className="text-sm text-muted-foreground">Workspace agent config from /api/agents/config</p>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-sm">Configured Agents ({agents.length})</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {agents.length === 0 ? <p className="text-sm text-muted-foreground">No saved agent configs.</p> : agents.map((a) => (
            <div key={a.id} className="rounded border p-2 text-sm">
              <div className="font-medium">{a.name || a.id}</div>
              <div className="text-xs text-muted-foreground">{a.model || 'unknown model'}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
