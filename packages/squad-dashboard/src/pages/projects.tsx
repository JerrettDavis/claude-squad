import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { projects, statusConfig, discussionTypeConfig } from '@/data/projects-mock'
import type { Project, Discussion } from '@/data/projects-mock'
import {
  FolderKanban, MessageSquare, GitPullRequest, CircleDot, Users,
  ThumbsUp, Rocket, PartyPopper, CheckCircle, Plus, Bot,
} from 'lucide-react'

function getTimeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime()
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return 'just now'
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

const reactionIcons: Record<string, typeof ThumbsUp> = {
  '👍': ThumbsUp,
  '🚀': Rocket,
  '🎉': PartyPopper,
  '✅': CheckCircle,
}

function ReactionBadges({ reactions }: { reactions: Record<string, number> }) {
  return (
    <div className="flex items-center gap-1.5">
      {Object.entries(reactions).map(([emoji, count]) => (
        <span
          key={emoji}
          className="inline-flex items-center gap-1 rounded-full border border-border bg-accent/30 px-2 py-0.5 text-xs text-muted-foreground"
        >
          {emoji} {count}
        </span>
      ))}
    </div>
  )
}

function DiscussionThread({ discussion }: { discussion: Discussion }) {
  const typeConfig = discussionTypeConfig[discussion.type]

  return (
    <div className="border-b border-border px-4 py-4">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-medium text-accent-foreground">
          {discussion.author.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-foreground">{discussion.author}</span>
            <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${typeConfig.color}`}>
              {typeConfig.label}
            </Badge>
            <span className="text-xs text-muted-foreground">{getTimeAgo(discussion.createdAt)}</span>
          </div>
          <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
            {discussion.content.split('\n').map((line, i) => {
              if (line.startsWith('## '))
                return <h3 key={i} className="text-sm font-semibold text-foreground mt-3 mb-1">{line.slice(3)}</h3>
              if (line.startsWith('### '))
                return <h4 key={i} className="text-sm font-medium text-foreground mt-2 mb-1">{line.slice(4)}</h4>
              if (line.startsWith('- '))
                return <li key={i} className="ml-4 text-sm text-muted-foreground">{line.slice(2)}</li>
              if (line.startsWith('```'))
                return null
              if (line.trim() === '') return <div key={i} className="h-1.5" />
              return <span key={i}>{line}{'\n'}</span>
            })}
          </div>
          {Object.keys(discussion.reactions).length > 0 && (
            <div className="mt-2">
              <ReactionBadges reactions={discussion.reactions} />
            </div>
          )}

          {/* Replies */}
          {discussion.replies.length > 0 && (
            <div className="mt-3 space-y-3 border-l-2 border-border pl-4">
              {discussion.replies.map((reply) => (
                <div key={reply.id}>
                  <div className="flex items-center gap-2 mb-1">
                    <Bot className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">{reply.author}</span>
                    <span className="text-xs text-muted-foreground">{getTimeAgo(reply.createdAt)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{reply.content}</p>
                  {Object.keys(reply.reactions).length > 0 && (
                    <div className="mt-1.5">
                      <ReactionBadges reactions={reply.reactions} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ProjectCard({ project, onSelect }: { project: Project; onSelect: () => void }) {
  const status = statusConfig[project.status]

  return (
    <Card className="cursor-pointer transition-all hover:border-foreground/20" onClick={onSelect}>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-sm font-semibold text-foreground">{project.title}</h3>
          <Badge variant="outline" className={`text-[10px] shrink-0 ${status.color}`}>
            {status.label}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{project.description}</p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" /> {project.discussions.length}
          </span>
          <span className="flex items-center gap-1">
            <CircleDot className="h-3 w-3" /> {project.linkedIssues.length}
          </span>
          <span className="flex items-center gap-1">
            <GitPullRequest className="h-3 w-3" /> {project.linkedPRs.length}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" /> {project.participants.length}
          </span>
        </div>
        <div className="mt-2 flex gap-1">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0">{tag}</Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function ProjectsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selectedProject = projects.find((p) => p.id === selectedId)

  const activeProjects = projects.filter((p) => p.status !== 'done')
  const doneProjects = projects.filter((p) => p.status === 'done')

  if (selectedProject) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setSelectedId(null)}>
            ← Back
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-foreground">{selectedProject.title}</h2>
              <Badge variant="outline" className={statusConfig[selectedProject.status].color}>
                {statusConfig[selectedProject.status].label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{selectedProject.description}</p>
          </div>
        </div>

        {/* Project meta */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <p className="text-xs text-muted-foreground mb-1">Participants</p>
              <div className="flex flex-wrap gap-1">
                {selectedProject.participants.map((p) => (
                  <Badge key={p} variant="secondary" className="text-xs">{p}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-xs text-muted-foreground mb-1">Linked Issues</p>
              <p className="text-lg font-bold text-foreground">
                {selectedProject.linkedIssues.map((n) => `#${n}`).join(', ') || 'None'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-xs text-muted-foreground mb-1">Linked PRs</p>
              <p className="text-lg font-bold text-foreground">
                {selectedProject.linkedPRs.map((n) => `#${n}`).join(', ') || 'None'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-xs text-muted-foreground mb-1">Activity</p>
              <p className="text-lg font-bold text-foreground">
                {selectedProject.discussions.reduce((sum, d) => sum + 1 + d.replies.length, 0)} messages
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Discussions */}
        <Card>
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Discussions</CardTitle>
              <Button variant="outline" size="sm" className="gap-2">
                <Plus className="h-3.5 w-3.5" /> New Discussion
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 pt-2">
            {selectedProject.discussions.map((discussion) => (
              <DiscussionThread key={discussion.id} discussion={discussion} />
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Projects</h2>
          <p className="text-sm text-muted-foreground">
            Plan, discuss, and coordinate work across your squad
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <FolderKanban className="h-3.5 w-3.5" /> New Project
        </Button>
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active ({activeProjects.length})</TabsTrigger>
          <TabsTrigger value="done">Completed ({doneProjects.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <div className="grid grid-cols-2 gap-4">
            {activeProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onSelect={() => setSelectedId(project.id)}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="done">
          <div className="grid grid-cols-2 gap-4">
            {doneProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onSelect={() => setSelectedId(project.id)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
