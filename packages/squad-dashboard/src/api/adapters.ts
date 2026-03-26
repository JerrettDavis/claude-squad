import type { Agent, Issue, PullRequest, ActivityEvent } from '@/types'
import type { ApiAgent, ApiIssue, ApiPullRequest, ApiEvent } from './client'

export function toAgent(a: ApiAgent): Agent {
  const status = a.status === 'running' ? 'active' : (a.status as Agent['status'])
  const uptime = typeof a.uptimeSec === 'number' ? `${Math.floor(a.uptimeSec / 3600)}h` : '0h'
  return {
    id: a.id,
    name: a.name || a.id,
    model: a.model || 'unknown',
    status: ['active', 'idle', 'error', 'offline'].includes(status) ? (status as Agent['status']) : 'idle',
    currentTask: a.currentTask || undefined,
    uptime,
    tokensUsed: (a.tokensIn || 0) + (a.tokensOut || 0),
    lastActivity: a.currentTask ? 'just now' : 'n/a',
  }
}

export function toIssue(i: ApiIssue): Issue {
  return {
    number: i.number,
    title: i.title,
    state: i.state,
    labels: (i.labels || []).map((l) => l.name),
    author: i.user?.login || 'unknown',
    createdAt: i.created_at || new Date().toISOString(),
    updatedAt: i.updated_at || new Date().toISOString(),
    commentCount: i.comments || 0,
    body: i.body || '',
  }
}

export function toPullRequest(p: ApiPullRequest): PullRequest {
  const state = p.state === 'open' && p.draft ? 'draft' : (p.state as PullRequest['state'])
  return {
    number: p.number,
    title: p.title,
    state: ['open', 'closed', 'merged', 'draft'].includes(state) ? (state as PullRequest['state']) : 'open',
    author: p.user?.login || 'unknown',
    branch: p.head?.ref || 'unknown',
    baseBranch: p.base?.ref || 'main',
    additions: p.additions || 0,
    deletions: p.deletions || 0,
    reviewStatus: 'none',
    checks: 'none',
    createdAt: p.created_at || new Date().toISOString(),
    updatedAt: p.updated_at || new Date().toISOString(),
    commentCount: p.comments || 0,
    body: '',
  }
}

export function toActivityEvent(e: ApiEvent, idx: number): ActivityEvent {
  const agent = String((e.payload?.agent as string) || (e.payload?.reviewer as string) || 'system')
  return {
    id: `${e.type}-${idx}-${e.ts}`,
    timestamp: e.ts,
    agent,
    type: 'status_change',
    message: e.type,
  }
}
