import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ActivityItem } from '@/components/activity-item'
import { useEvents } from '@/api/hooks'
import { toActivityEvent } from '@/api/adapters'

export function ActivityPage() {
  const { data } = useEvents()
  const activityFeed = (data || []).map(toActivityEvent)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Activity Feed</h2>
        <p className="text-sm text-muted-foreground">
          Real-time log of agent actions across your squad
        </p>
      </div>

      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-sm font-semibold">All Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-0 pt-2">
          {activityFeed.map((event) => (
            <ActivityItem key={event.id} event={event} />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
