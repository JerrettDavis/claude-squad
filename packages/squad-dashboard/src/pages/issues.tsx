import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { IssueRow } from '@/components/issue-row'
import { issues } from '@/data/mock'

export function IssuesPage() {
  const openIssues = issues.filter((i) => i.state === 'open')
  const closedIssues = issues.filter((i) => i.state === 'closed')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Issues</h2>
        <p className="text-sm text-muted-foreground">
          {openIssues.length} open, {closedIssues.length} closed
        </p>
      </div>

      <Tabs defaultValue="open">
        <TabsList>
          <TabsTrigger value="open">Open ({openIssues.length})</TabsTrigger>
          <TabsTrigger value="closed">Closed ({closedIssues.length})</TabsTrigger>
          <TabsTrigger value="all">All ({issues.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="open">
          <Card>
            <CardHeader className="pb-0">
              <CardTitle className="text-sm font-semibold">Open Issues</CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-2">
              {openIssues.map((issue) => (
                <IssueRow key={issue.number} issue={issue} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="closed">
          <Card>
            <CardHeader className="pb-0">
              <CardTitle className="text-sm font-semibold">Closed Issues</CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-2">
              {closedIssues.map((issue) => (
                <IssueRow key={issue.number} issue={issue} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="all">
          <Card>
            <CardHeader className="pb-0">
              <CardTitle className="text-sm font-semibold">All Issues</CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-2">
              {issues.map((issue) => (
                <IssueRow key={issue.number} issue={issue} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
