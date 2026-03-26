import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useGitLog } from '@/api/hooks'

export function HistoryPage() {
  const { data: commits = [] } = useGitLog(50)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">History</h2>
        <p className="text-sm text-muted-foreground">Live commit history from API</p>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-sm">Commits ({commits.length})</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {commits.length === 0 ? <p className="text-sm text-muted-foreground">No commits detected in workspace.</p> : commits.map((c) => (
            <div key={c.hash} className="rounded border p-2 text-sm">
              <div className="font-medium">{c.shortHash} · {c.message}</div>
              <div className="text-xs text-muted-foreground">{c.author}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
