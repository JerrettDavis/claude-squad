import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { branches } from '@/data/git-mock'
import { GitBranch, Shield, ArrowUp, ArrowDown, FolderOpen } from 'lucide-react'

function getTimeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime()
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return 'just now'
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export function BranchesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Branches</h2>
        <p className="text-sm text-muted-foreground">
          {branches.length} branches across the repository
        </p>
      </div>

      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-sm font-semibold">All Branches</CardTitle>
        </CardHeader>
        <CardContent className="p-0 pt-2">
          {branches.map((branch) => (
            <div
              key={branch.name}
              className="flex items-center gap-3 border-b border-border px-4 py-3 hover:bg-accent/30 transition-colors"
            >
              <GitBranch className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-medium text-foreground">
                    {branch.name}
                  </span>
                  {branch.isDefault && (
                    <Badge variant="outline" className="text-[10px]">default</Badge>
                  )}
                  {branch.isProtected && (
                    <Badge variant="outline" className="text-[10px] gap-1 text-yellow-400 border-yellow-500/20">
                      <Shield className="h-2.5 w-2.5" /> protected
                    </Badge>
                  )}
                  {branch.worktree && (
                    <Badge variant="outline" className="text-[10px] gap-1 text-cyan-400 border-cyan-500/20">
                      <FolderOpen className="h-2.5 w-2.5" /> worktree
                    </Badge>
                  )}
                </div>
                <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{branch.lastCommit}</span>
                  <span>by {branch.author}</span>
                  <span>{getTimeAgo(branch.lastCommitDate)}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs shrink-0">
                {branch.ahead > 0 && (
                  <span className="flex items-center gap-1 text-green-500">
                    <ArrowUp className="h-3 w-3" />{branch.ahead}
                  </span>
                )}
                {branch.behind > 0 && (
                  <span className="flex items-center gap-1 text-red-400">
                    <ArrowDown className="h-3 w-3" />{branch.behind}
                  </span>
                )}
                {branch.ahead === 0 && branch.behind === 0 && (
                  <span className="text-muted-foreground">up to date</span>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
