import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useGitBranches } from '@/api/hooks'

export function BranchesPage() {
  const { data: branches = [] } = useGitBranches()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Branches</h2>
        <p className="text-sm text-muted-foreground">Live git branch data from API</p>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-sm">Branches ({branches.length})</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {branches.length === 0 ? <p className="text-sm text-muted-foreground">No branches detected in workspace.</p> : branches.map((b) => (
            <div key={b.name} className="rounded border p-2 text-sm">
              <div className="font-medium">{b.name}</div>
              <div className="text-xs text-muted-foreground">{b.lastCommit}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
