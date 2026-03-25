import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { repoFiles, branches } from '@/data/git-mock'
import { Folder, File, GitBranch, ChevronRight } from 'lucide-react'
import { useState } from 'react'

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function RepoPage() {
  const [currentBranch, setCurrentBranch] = useState('main')
  const [showBranchPicker, setShowBranchPicker] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Repository</h2>
          <p className="text-sm text-muted-foreground">Browse files in @jerrettdavis/claude-squad</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowBranchPicker(!showBranchPicker)}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors"
          >
            <GitBranch className="h-4 w-4" />
            {currentBranch}
            <ChevronRight className={`h-3 w-3 transition-transform ${showBranchPicker ? 'rotate-90' : ''}`} />
          </button>
          {showBranchPicker && (
            <div className="absolute right-0 top-full mt-1 z-50 w-64 rounded-lg border border-border bg-card shadow-lg">
              {branches.map((b) => (
                <button
                  key={b.name}
                  onClick={() => { setCurrentBranch(b.name); setShowBranchPicker(false) }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-left hover:bg-accent transition-colors first:rounded-t-lg last:rounded-b-lg"
                >
                  <GitBranch className="h-3 w-3 text-muted-foreground" />
                  <span className={currentBranch === b.name ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                    {b.name}
                  </span>
                  {b.isDefault && <Badge variant="outline" className="ml-auto text-[10px]">default</Badge>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-sm font-semibold">Files</CardTitle>
        </CardHeader>
        <CardContent className="p-0 pt-2">
          {repoFiles.map((file) => (
            <div
              key={file.name}
              className="flex items-center gap-3 border-b border-border px-4 py-2.5 hover:bg-accent/30 transition-colors cursor-pointer"
            >
              {file.type === 'dir' ? (
                <Folder className="h-4 w-4 text-blue-400" />
              ) : (
                <File className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="flex-1 text-sm text-foreground hover:text-primary">
                {file.name}
              </span>
              <span className="text-xs text-muted-foreground max-w-[300px] truncate">
                {file.lastCommit}
              </span>
              <span className="text-xs text-muted-foreground w-24 text-right">
                {file.lastCommitDate}
              </span>
              {file.size != null && (
                <span className="text-xs text-muted-foreground w-16 text-right">
                  {formatSize(file.size)}
                </span>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
