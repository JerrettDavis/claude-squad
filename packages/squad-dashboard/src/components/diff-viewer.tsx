import type { DiffFile, DiffLine } from '@/data/git-mock'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Minus, FileEdit, FilePlus, FileMinus, FileSymlink } from 'lucide-react'
import { cn } from '@/lib/utils'

const statusIcons = {
  added: FilePlus,
  modified: FileEdit,
  deleted: FileMinus,
  renamed: FileSymlink,
}

const statusColors = {
  added: 'text-green-500',
  modified: 'text-yellow-500',
  deleted: 'text-red-500',
  renamed: 'text-blue-400',
}

function DiffLineRow({ line }: { line: DiffLine }) {
  return (
    <div
      className={cn(
        'flex font-mono text-xs leading-6',
        line.type === 'addition' && 'bg-green-500/10',
        line.type === 'deletion' && 'bg-red-500/10',
      )}
    >
      <span className="w-12 shrink-0 select-none text-right pr-2 text-muted-foreground/50">
        {line.lineOld ?? ''}
      </span>
      <span className="w-12 shrink-0 select-none text-right pr-2 text-muted-foreground/50">
        {line.lineNew ?? ''}
      </span>
      <span className="w-4 shrink-0 select-none text-center">
        {line.type === 'addition' && <span className="text-green-500">+</span>}
        {line.type === 'deletion' && <span className="text-red-500">-</span>}
      </span>
      <span className={cn(
        'flex-1 whitespace-pre px-2',
        line.type === 'addition' && 'text-green-400',
        line.type === 'deletion' && 'text-red-400',
        line.type === 'context' && 'text-muted-foreground',
      )}>
        {line.content}
      </span>
    </div>
  )
}

export function DiffViewer({ files }: { files: DiffFile[] }) {
  return (
    <div className="space-y-4">
      {files.map((file) => {
        const Icon = statusIcons[file.status]
        return (
          <Card key={file.path}>
            <CardHeader className="py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={cn('h-4 w-4', statusColors[file.status])} />
                  <span className="font-mono text-sm text-foreground">{file.path}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant="outline" className="gap-1 text-green-500 border-green-500/20">
                    <Plus className="h-3 w-3" />{file.additions}
                  </Badge>
                  <Badge variant="outline" className="gap-1 text-red-400 border-red-500/20">
                    <Minus className="h-3 w-3" />{file.deletions}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto border-t border-border">
              {file.hunks.map((hunk, i) => (
                <div key={i}>
                  <div className="bg-accent/50 px-4 py-1 font-mono text-xs text-muted-foreground">
                    {hunk.header}
                  </div>
                  {hunk.lines.map((line, j) => (
                    <DiffLineRow key={j} line={line} />
                  ))}
                </div>
              ))}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
