import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useIssues, useAgents } from '@/api/hooks'

export function TriagePage() {
  const { data: issues = [] } = useIssues()
  const { data: agents = [] } = useAgents()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Ralph Triage</h2>
        <p className="text-sm text-muted-foreground">Live triage inputs from issues + agent capacity</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-sm">Open Issues</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{issues.filter(i => i.state === 'open').length}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">Available Agents</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{agents.length}</p></CardContent>
        </Card>
      </div>
    </div>
  )
}
