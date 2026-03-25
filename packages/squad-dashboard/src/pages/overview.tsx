import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AgentCard } from '@/components/agent-card'
import { IssueRow } from '@/components/issue-row'
import { PrRow } from '@/components/pr-row'
import { ActivityItem } from '@/components/activity-item'
import { agents, issues, pullRequests, activityFeed } from '@/data/mock'
import { Bot, CircleDot, GitPullRequest, Activity } from 'lucide-react'
import { Link } from 'react-router-dom'

export function OverviewPage() {
  const activeAgents = agents.filter((a) => a.status === 'active').length
  const openIssues = issues.filter((i) => i.state === 'open').length
  const openPrs = pullRequests.filter((p) => p.state === 'open' || p.state === 'draft').length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Overview</h2>
        <p className="text-sm text-muted-foreground">Monitor your squad at a glance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
              <Bot className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{activeAgents}</p>
              <p className="text-xs text-muted-foreground">Active Agents</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <CircleDot className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{openIssues}</p>
              <p className="text-xs text-muted-foreground">Open Issues</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
              <GitPullRequest className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{openPrs}</p>
              <p className="text-xs text-muted-foreground">Open PRs</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
              <Activity className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{activityFeed.length}</p>
              <p className="text-xs text-muted-foreground">Events Today</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agents */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Agents</h3>
          <Link to="/agents" className="text-xs text-muted-foreground hover:text-foreground">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {agents.slice(0, 4).map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Recent Issues */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Recent Issues</CardTitle>
              <Link to="/issues" className="text-xs text-muted-foreground hover:text-foreground">
                View all →
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {issues.slice(0, 3).map((issue) => (
              <IssueRow key={issue.number} issue={issue} />
            ))}
          </CardContent>
        </Card>

        {/* Activity */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
              <Link to="/activity" className="text-xs text-muted-foreground hover:text-foreground">
                View all →
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {activityFeed.slice(0, 4).map((event) => (
              <ActivityItem key={event.id} event={event} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
