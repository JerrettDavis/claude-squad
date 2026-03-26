import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PrRow } from '@/components/pr-row'
import { usePullRequests } from '@/api/hooks'
import { toPullRequest } from '@/api/adapters'

export function PullsPage() {
  const { data } = usePullRequests()
  const pullRequests = (data || []).map(toPullRequest)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Pull Requests</h2>
        <p className="text-sm text-muted-foreground">
          {pullRequests.filter((p) => p.state === 'open' || p.state === 'draft').length} open
        </p>
      </div>

      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-sm font-semibold">All Pull Requests</CardTitle>
        </CardHeader>
        <CardContent className="p-0 pt-2">
          {pullRequests.map((pr) => (
            <PrRow key={pr.number} pr={pr} />
          ))}
          {pullRequests.length === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No pull requests yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
