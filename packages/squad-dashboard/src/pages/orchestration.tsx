import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEvents } from '@/api/hooks'

export function OrchestrationPage() {
  const { data: events = [] } = useEvents()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Orchestration Log</h2>
        <p className="text-sm text-muted-foreground">Live event stream/poll log from API</p>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-sm">Events ({events.length})</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {events.length === 0 ? <p className="text-sm text-muted-foreground">No events yet.</p> : events.slice().reverse().map((e, i) => (
            <div key={`${e.type}-${e.ts}-${i}`} className="rounded border p-2 text-sm">
              <div className="font-medium">{e.type}</div>
              <div className="text-xs text-muted-foreground">{e.ts}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
