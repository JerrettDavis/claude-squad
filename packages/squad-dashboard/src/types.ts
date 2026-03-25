export type AgentStatus = 'active' | 'idle' | 'error' | 'offline'

export interface Agent {
  id: string
  name: string
  model: string
  status: AgentStatus
  currentTask?: string
  issueRef?: string
  prRef?: string
  uptime: string
  tokensUsed: number
  lastActivity: string
}

export interface Issue {
  number: number
  title: string
  state: 'open' | 'closed'
  labels: string[]
  assignedAgent?: string
  author: string
  createdAt: string
  updatedAt: string
  commentCount: number
  body: string
}

export interface PullRequest {
  number: number
  title: string
  state: 'open' | 'closed' | 'merged' | 'draft'
  author: string
  agent?: string
  branch: string
  baseBranch: string
  additions: number
  deletions: number
  reviewStatus: 'pending' | 'approved' | 'changes_requested' | 'none'
  checks: 'passing' | 'failing' | 'pending' | 'none'
  createdAt: string
  updatedAt: string
  commentCount: number
  body: string
}

export interface ActivityEvent {
  id: string
  timestamp: string
  agent: string
  type: 'commit' | 'pr_opened' | 'pr_merged' | 'issue_assigned' | 'comment' | 'review' | 'error' | 'status_change'
  message: string
  ref?: string
}
