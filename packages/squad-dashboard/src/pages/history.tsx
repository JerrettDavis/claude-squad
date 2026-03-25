import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DiffViewer } from '@/components/diff-viewer'
import { commits, sampleDiff } from '@/data/git-mock'
import { GitCommit, GitBranch, Plus, Minus, FileEdit } from 'lucide-react'

function getTimeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime()
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return 'just now'
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export function HistoryPage() {
  const [selectedCommit, setSelectedCommit] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">History</h2>
        <p className="text-sm text-muted-foreground">
          Git log with commit graph and diff viewer
        </p>
      </div>

      <div className="grid grid-cols-5 gap-6">
        {/* Commit list with graph */}
        <div className="col-span-3">
          <Card>
            <CardHeader className="pb-0">
              <CardTitle className="text-sm font-semibold">Commits</CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-2">
              {commits.map((commit, i) => (
                <div
                  key={commit.hash}
                  onClick={() => setSelectedCommit(selectedCommit === commit.hash ? null : commit.hash)}
                  className={`flex gap-3 border-b border-border px-4 py-3 cursor-pointer transition-colors ${
                    selectedCommit === commit.hash ? 'bg-accent' : 'hover:bg-accent/30'
                  }`}
                >
                  {/* Simple graph column */}
                  <div className="flex flex-col items-center w-6 shrink-0">
                    <div className={`h-3 w-3 rounded-full border-2 ${
                      i === 0 ? 'border-green-500 bg-green-500/30' : 'border-muted-foreground bg-background'
                    }`} />
                    {i < commits.length - 1 && (
                      <div className="flex-1 w-px bg-border mt-1" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground truncate">
                        {commit.message}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="font-mono text-primary/70">{commit.shortHash}</span>
                      <span>{commit.author}</span>
                      <span>{getTimeAgo(commit.date)}</span>
                      <Badge variant="outline" className="text-[10px] gap-1">
                        <GitBranch className="h-2.5 w-2.5" />
                        {commit.branch}
                      </Badge>
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1 text-green-500">
                        <Plus className="h-3 w-3" />{commit.additions}
                      </span>
                      <span className="flex items-center gap-1 text-red-400">
                        <Minus className="h-3 w-3" />{commit.deletions}
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <FileEdit className="h-3 w-3" />{commit.filesChanged} files
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Diff panel */}
        <div className="col-span-2">
          {selectedCommit ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <GitCommit className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono text-sm text-foreground">
                  {commits.find((c) => c.hash === selectedCommit)?.shortHash}
                </span>
                <span className="text-sm text-muted-foreground">
                  {commits.find((c) => c.hash === selectedCommit)?.message}
                </span>
              </div>
              <DiffViewer files={sampleDiff} />
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-16">
                <p className="text-sm text-muted-foreground">
                  Select a commit to view its diff
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
