import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAgents } from '@/api/hooks'

export function CostsPage() {
  const { data: agents = [] } = useAgents()
  const total = agents.reduce((sum, a) => sum + (a.costUsd || 0), 0)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Cost Tracking</h2>
        <p className="text-sm text-muted-foreground">Computed from live agent telemetry</p>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-sm">Total Cost</CardTitle></CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">${total.toFixed(2)}</p>
        </CardContent>
      </Card>
    </div>
  )
}
