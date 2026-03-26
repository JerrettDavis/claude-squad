import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEvents } from '@/api/hooks'

export function DecisionsPage() {
  const { data: events = [] } = useEvents()
  const decisionEvents = events.filter((e) => e.type.includes('decision') || e.type.includes('review'))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Decision Inbox</h2>
        <p className="text-sm text-muted-foreground">Human-in-the-loop decisions from live events</p>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-sm">Pending Decisions ({decisionEvents.length})</CardTitle></CardHeader>
        <CardContent>
          {decisionEvents.length === 0 ? <p className="text-sm text-muted-foreground">No pending decisions.</p> : decisionEvents.map((e, i) => (
            <div key={`${e.type}-${i}`} className="rounded border p-2 text-sm mb-2">{e.type}</div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
