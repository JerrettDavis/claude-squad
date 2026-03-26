import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useIssues, usePullRequests } from '@/api/hooks'

export function ProjectsPage() {
  const { data: issues = [] } = useIssues()
  const { data: prs = [] } = usePullRequests()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Projects</h2>
        <p className="text-sm text-muted-foreground">Planning view backed by live issues/PRs</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-sm">Issue Backlog</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{issues.length}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">PR Pipeline</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{prs.length}</p></CardContent>
        </Card>
      </div>
    </div>
  )
}
