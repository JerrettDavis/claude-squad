export interface TriageEntry {
  id: string
  issueNumber: number
  issueTitle: string
  labels: string[]
  triageResult: {
    agent: string
    reason: string
    source: 'module-ownership' | 'routing-rule' | 'role-keyword' | 'lead-fallback'
    confidence: 'high' | 'medium' | 'low'
  }
  timestamp: string
  status: 'assigned' | 'pending' | 'rejected' | 'escalated'
}

export interface RoutingRule {
  workType: string
  agentName: string
  keywords: string[]
}

export interface ModuleOwnership {
  modulePath: string
  primary: string
  secondary: string | null
}

export interface OrchestrationEvent {
  id: string
  timestamp: string
  type: 'triage' | 'assignment' | 'escalation' | 'completion' | 'error' | 'status' | 'cast'
  agent: string
  message: string
  details?: string
}

export interface Decision {
  id: string
  timestamp: string
  type: 'conflict' | 'escalation' | 'approval' | 'resource'
  title: string
  description: string
  requestedBy: string
  status: 'pending' | 'approved' | 'rejected' | 'deferred'
  options: DecisionOption[]
  context?: string
}

export interface DecisionOption {
  label: string
  description: string
  recommended?: boolean
}

export interface AgentCapability {
  agent: string
  capabilities: string[]
  workload: number
  successRate: number
  tokensRemaining: number
  cooldownUntil?: string
}

export const routingRules: RoutingRule[] = [
  { workType: 'Bug fix', agentName: 'Copilot Agent', keywords: ['fix', 'bug', 'error', 'crash'] },
  { workType: 'Feature', agentName: 'Claude Bot', keywords: ['feature', 'add', 'implement', 'build'] },
  { workType: 'Documentation', agentName: 'Copilot Agent', keywords: ['docs', 'readme', 'guide'] },
  { workType: 'Infrastructure', agentName: 'Copilot Agent', keywords: ['ci', 'cd', 'deploy', 'workflow'] },
  { workType: 'Triage', agentName: 'Ralph', keywords: ['triage', 'classify', 'route'] },
  { workType: 'Review', agentName: 'Claude Bot', keywords: ['review', 'audit', 'check'] },
]

export const moduleOwnership: ModuleOwnership[] = [
  { modulePath: 'packages/squad-sdk', primary: 'Copilot Agent', secondary: 'Claude Bot' },
  { modulePath: 'packages/squad-cli', primary: 'Copilot Agent', secondary: null },
  { modulePath: 'packages/squad-dashboard', primary: 'Claude Bot', secondary: null },
  { modulePath: 'docs/', primary: 'Copilot Agent', secondary: 'Claude Bot' },
  { modulePath: 'test/', primary: 'Copilot Agent', secondary: 'Claude Bot' },
  { modulePath: '.github/workflows', primary: 'Copilot Agent', secondary: null },
]

export const triageHistory: TriageEntry[] = [
  {
    id: 't1',
    issueNumber: 3,
    issueTitle: 'Build squad dashboard for agent monitoring',
    labels: ['feature', 'dashboard'],
    triageResult: {
      agent: 'Claude Bot',
      reason: 'Feature work matching "build" keyword, module ownership of packages/squad-dashboard',
      source: 'module-ownership',
      confidence: 'high',
    },
    timestamp: '2026-03-25T21:14:00Z',
    status: 'assigned',
  },
  {
    id: 't2',
    issueNumber: 1,
    issueTitle: 'CI/CD tests fail due to CommonJS/ESM mismatch',
    labels: ['bug', 'ci'],
    triageResult: {
      agent: 'Copilot Agent',
      reason: 'Bug fix in test/ directory, routing rule match for "bug fix" + module ownership',
      source: 'routing-rule',
      confidence: 'high',
    },
    timestamp: '2026-03-24T10:30:00Z',
    status: 'assigned',
  },
  {
    id: 't3',
    issueNumber: 4,
    issueTitle: 'Add Claude Code adapter to squad SDK',
    labels: ['feature', 'sdk'],
    triageResult: {
      agent: 'Claude Bot',
      reason: 'Feature request involving Claude Code integration, keyword match for "implement"',
      source: 'routing-rule',
      confidence: 'medium',
    },
    timestamp: '2026-03-23T09:30:00Z',
    status: 'pending',
  },
]

export const orchestrationLog: OrchestrationEvent[] = [
  {
    id: 'o1',
    timestamp: '2026-03-25T21:34:00Z',
    type: 'assignment',
    agent: 'Claude Bot',
    message: 'Assigned to build Wiki and Projects pages',
    details: 'Directive from JerrettDavis via Discord',
  },
  {
    id: 'o2',
    timestamp: '2026-03-25T21:18:00Z',
    type: 'assignment',
    agent: 'Claude Bot',
    message: 'Assigned to build squad dashboard MVP',
    details: 'Issue #3, routed via module-ownership (packages/squad-dashboard)',
  },
  {
    id: 'o3',
    timestamp: '2026-03-25T17:30:00Z',
    type: 'completion',
    agent: 'Claude Bot',
    message: 'Completed review of PR #1 — all 110 tests pass',
  },
  {
    id: 'o4',
    timestamp: '2026-03-25T16:40:00Z',
    type: 'triage',
    agent: 'Ralph',
    message: 'Triaged PR #1 to Copilot Agent for CI/CD fix',
    details: 'Confidence: high, Source: routing-rule',
  },
  {
    id: 'o5',
    timestamp: '2026-03-25T15:37:00Z',
    type: 'completion',
    agent: 'Copilot Agent',
    message: 'Completed README update with fork documentation (6253c3f)',
  },
  {
    id: 'o6',
    timestamp: '2026-03-25T13:00:00Z',
    type: 'cast',
    agent: 'System',
    message: 'Cast team: Copilot Agent (core-dev), Claude Bot (architect), JD.AI (assistant), Ralph (triage)',
  },
  {
    id: 'o7',
    timestamp: '2026-03-25T12:00:00Z',
    type: 'status',
    agent: 'JD.AI',
    message: 'Daemon started — Ollama/qwen3.5:9b online',
  },
  {
    id: 'o8',
    timestamp: '2026-03-24T22:00:00Z',
    type: 'error',
    agent: 'Ralph',
    message: 'Lost connection to triage service',
    details: 'ECONNREFUSED on localhost:15790',
  },
]

export const decisions: Decision[] = [
  {
    id: 'dec1',
    timestamp: '2026-03-25T21:30:00Z',
    type: 'approval',
    title: 'Merge PR #1: ESM Migration',
    description: 'PR #1 has passed all 110 tests and been reviewed by Claude Bot. Ready for merge to main.',
    requestedBy: 'Claude Bot',
    status: 'pending',
    options: [
      { label: 'Merge', description: 'Merge to main branch', recommended: true },
      { label: 'Squash & Merge', description: 'Squash commits and merge' },
      { label: 'Defer', description: 'Hold until more testing' },
    ],
    context: 'All tests pass. 2 pre-existing CodeQL alerts (out of scope). No merge conflicts.',
  },
  {
    id: 'dec2',
    timestamp: '2026-03-25T21:00:00Z',
    type: 'resource',
    title: 'Dashboard Tech Stack Decision',
    description: 'Need approval on React + Vite + Tailwind + shadcn/ui for the squad dashboard.',
    requestedBy: 'Claude Bot',
    status: 'approved',
    options: [
      { label: 'React + Vite', description: 'Lightweight, fast, no vendor lock-in', recommended: true },
      { label: 'Next.js', description: 'More features but Vercel-oriented' },
      { label: 'Vue + Vite', description: 'Alternative framework' },
    ],
    context: 'User specified: no Vercel lock-in, fast/easy/maintainable, shadcn/ui for components.',
  },
  {
    id: 'dec3',
    timestamp: '2026-03-23T12:00:00Z',
    type: 'conflict',
    title: 'Claude Code Adapter: API vs CLI Mode',
    description: 'RFC open question: should the adapter support both Claude API and Claude Code CLI modes, or CLI-only?',
    requestedBy: 'Copilot Agent',
    status: 'pending',
    options: [
      { label: 'CLI-only', description: 'Simpler, leverages existing Claude Code tooling', recommended: true },
      { label: 'API + CLI', description: 'More flexible but doubles the implementation surface' },
      { label: 'API-only', description: 'Direct API calls, no CLI dependency' },
    ],
    context: 'Claude Code CLI already handles auth, tool dispatch, and streaming. API mode adds direct Anthropic SDK calls.',
  },
]

export const agentCapabilities: AgentCapability[] = [
  {
    agent: 'Copilot Agent',
    capabilities: ['browser', 'personal-gh', 'docker'],
    workload: 65,
    successRate: 94,
    tokensRemaining: 450_000,
  },
  {
    agent: 'Claude Bot',
    capabilities: ['browser', 'personal-gh'],
    workload: 80,
    successRate: 97,
    tokensRemaining: 820_000,
  },
  {
    agent: 'JD.AI',
    capabilities: ['browser'],
    workload: 10,
    successRate: 78,
    tokensRemaining: 100_000,
  },
  {
    agent: 'Ralph',
    capabilities: ['personal-gh'],
    workload: 0,
    successRate: 0,
    tokensRemaining: 0,
  },
]
