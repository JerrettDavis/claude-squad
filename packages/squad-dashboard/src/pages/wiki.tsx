import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useWikiPages } from '@/api/hooks'

export function WikiPage() {
  const { data: pages = [] } = useWikiPages()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Wiki</h2>
        <p className="text-sm text-muted-foreground">Workspace-scoped knowledge pages from API</p>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-sm">Pages ({pages.length})</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {pages.length === 0 ? <p className="text-sm text-muted-foreground">No wiki pages yet.</p> : pages.map((p) => (
            <div key={p.slug} className="rounded border p-2 text-sm">
              <div className="font-medium">{p.title}</div>
              <div className="text-xs text-muted-foreground">/{p.slug}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
