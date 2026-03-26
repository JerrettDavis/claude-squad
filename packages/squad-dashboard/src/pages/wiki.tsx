import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { wikiPages } from '@/data/wiki-mock'
import { BookOpen, Edit, Clock, User, Tag, ChevronRight } from 'lucide-react'

function getTimeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime()
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return 'just now'
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export function WikiPage() {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const selectedPage = wikiPages.find((p) => p.slug === selectedSlug)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Wiki</h2>
          <p className="text-sm text-muted-foreground">
            Distilled repo knowledge — readable and writable by agents
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Edit className="h-3.5 w-3.5" /> New Page
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Page list */}
        <div className="col-span-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Pages</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {wikiPages.map((page) => (
                <button
                  key={page.slug}
                  onClick={() => setSelectedSlug(page.slug)}
                  className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors border-b border-border ${
                    selectedSlug === page.slug
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:bg-accent/30 hover:text-foreground'
                  }`}
                >
                  <BookOpen className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{page.title}</span>
                  <ChevronRight className="ml-auto h-3 w-3 shrink-0 opacity-50" />
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Page content */}
        <div className="col-span-3">
          {selectedPage ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{selectedPage.title}</CardTitle>
                  <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                    <Edit className="h-3.5 w-3.5" /> Edit
                  </Button>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" /> {selectedPage.lastEditor}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {getTimeAgo(selectedPage.updatedAt)}
                  </span>
                  <span>{selectedPage.editCount} edits</span>
                  <div className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {selectedPage.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm prose-invert max-w-none">
                  {selectedPage.content.split('\n').map((line, i) => {
                    if (line.startsWith('# '))
                      return <h1 key={i} className="text-xl font-bold text-foreground mt-6 mb-3">{line.slice(2)}</h1>
                    if (line.startsWith('## '))
                      return <h2 key={i} className="text-lg font-semibold text-foreground mt-5 mb-2">{line.slice(3)}</h2>
                    if (line.startsWith('### '))
                      return <h3 key={i} className="text-base font-semibold text-foreground mt-4 mb-2">{line.slice(4)}</h3>
                    if (line.startsWith('```'))
                      return <div key={i} className="font-mono text-xs bg-accent/50 rounded px-1" />
                    if (line.startsWith('- '))
                      return <li key={i} className="text-sm text-muted-foreground ml-4">{line.slice(2)}</li>
                    if (line.trim() === '') return <div key={i} className="h-2" />
                    return <p key={i} className="text-sm text-muted-foreground leading-relaxed">{line}</p>
                  })}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <BookOpen className="h-8 w-8 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">Select a page to view its content</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {wikiPages.length} pages in the wiki
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
