import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useGitBranches } from '@/api/hooks'

export function RepoPage() {
  const { data: branches = [] } = useGitBranches()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Repository Browser</h2>
        <p className="text-sm text-muted-foreground">Workspace repo metadata from API (no mock data)</p>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-sm">Repository Snapshot</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Branch count: {branches.length}</p>
          <p className="text-xs text-muted-foreground mt-2">File-tree endpoint can be added next if needed.</p>
        </CardContent>
      </Card>
    </div>
  )
}
