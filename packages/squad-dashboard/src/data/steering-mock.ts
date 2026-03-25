export interface AgentSession {
  id: string
  agent: string
  model: string
  status: 'running' | 'paused' | 'stopped' | 'error'
  startedAt: string
  currentTask: string
  pid?: number
  outputLines: OutputLine[]
  tokensIn: number
  tokensOut: number
  costUsd: number
  requestCount: number
}

export interface OutputLine {
  timestamp: string
  type: 'stdout' | 'stderr' | 'tool' | 'thinking'
  content: string
}

export interface CostEntry {
  agent: string
  model: string
  date: string
  tokensIn: number
  tokensOut: number
  costUsd: number
  requestCount: number
}

export const agentSessions: AgentSession[] = [
  {
    id: 'sess-claude',
    agent: 'Claude Bot',
    model: 'Claude Opus 4.6',
    status: 'running',
    startedAt: '2026-03-25T19:01:00Z',
    currentTask: 'Building squad dashboard — Phase 4: steering controls',
    pid: 3920,
    tokensIn: 142_000,
    tokensOut: 87_400,
    costUsd: 4.82,
    requestCount: 47,
    outputLines: [
      { timestamp: '2026-03-25T22:14:00Z', type: 'tool', content: 'Write → src/pages/steering.tsx' },
      { timestamp: '2026-03-25T22:13:00Z', type: 'tool', content: 'Read → src/components/layout/sidebar.tsx' },
      { timestamp: '2026-03-25T22:12:00Z', type: 'stdout', content: '15/15 Playwright tests passing' },
      { timestamp: '2026-03-25T22:11:00Z', type: 'tool', content: 'Bash → npx playwright test' },
      { timestamp: '2026-03-25T22:10:00Z', type: 'tool', content: 'Write → src/pages/decisions.tsx' },
      { timestamp: '2026-03-25T22:08:00Z', type: 'thinking', content: 'Building decision inbox with pending/resolved tabs and option selection...' },
      { timestamp: '2026-03-25T22:05:00Z', type: 'tool', content: 'Write → src/pages/orchestration.tsx' },
      { timestamp: '2026-03-25T22:00:00Z', type: 'tool', content: 'Write → src/pages/triage.tsx' },
    ],
  },
  {
    id: 'sess-copilot',
    agent: 'Copilot Agent',
    model: 'GPT-4.1',
    status: 'running',
    startedAt: '2026-03-25T15:00:00Z',
    currentTask: 'Hardening AgentHub backend + orchestration test matrix',
    pid: 52732,
    tokensIn: 98_200,
    tokensOut: 64_300,
    costUsd: 2.14,
    requestCount: 32,
    outputLines: [
      { timestamp: '2026-03-25T22:10:00Z', type: 'tool', content: 'Bash → npm run test:integration' },
      { timestamp: '2026-03-25T22:08:00Z', type: 'stdout', content: 'All integration tests passing' },
      { timestamp: '2026-03-25T22:05:00Z', type: 'tool', content: 'Edit → packages/squad-sdk/src/adapter/types.ts' },
      { timestamp: '2026-03-25T22:00:00Z', type: 'thinking', content: 'Reviewing adapter interface for Claude Code compatibility...' },
    ],
  },
  {
    id: 'sess-jdai',
    agent: 'JD.AI',
    model: 'Ollama qwen3.5:9b',
    status: 'paused',
    startedAt: '2026-03-25T18:40:00Z',
    currentTask: 'Waiting for .NET releases lookup request',
    pid: 26136,
    tokensIn: 12_400,
    tokensOut: 8_100,
    costUsd: 0,
    requestCount: 8,
    outputLines: [
      { timestamp: '2026-03-25T18:07:00Z', type: 'stdout', content: 'Described photo contents in Discord' },
      { timestamp: '2026-03-25T18:05:00Z', type: 'tool', content: 'download_attachment → photo.jpg' },
    ],
  },
  {
    id: 'sess-ralph',
    agent: 'Ralph (Triage)',
    model: 'Claude Sonnet 4.6',
    status: 'stopped',
    startedAt: '2026-03-24T09:00:00Z',
    currentTask: 'Service stopped',
    tokensIn: 0,
    tokensOut: 0,
    costUsd: 0,
    requestCount: 0,
    outputLines: [
      { timestamp: '2026-03-24T22:00:00Z', type: 'stderr', content: 'ECONNREFUSED: connection lost' },
    ],
  },
]

export const costHistory: CostEntry[] = [
  { agent: 'Claude Bot', model: 'Claude Opus 4.6', date: '2026-03-25', tokensIn: 142000, tokensOut: 87400, costUsd: 4.82, requestCount: 47 },
  { agent: 'Copilot Agent', model: 'GPT-4.1', date: '2026-03-25', tokensIn: 98200, tokensOut: 64300, costUsd: 2.14, requestCount: 32 },
  { agent: 'JD.AI', model: 'qwen3.5:9b', date: '2026-03-25', tokensIn: 12400, tokensOut: 8100, costUsd: 0, requestCount: 8 },
  { agent: 'Claude Bot', model: 'Claude Opus 4.6', date: '2026-03-24', tokensIn: 68000, tokensOut: 42000, costUsd: 2.31, requestCount: 22 },
  { agent: 'Copilot Agent', model: 'GPT-4.1', date: '2026-03-24', tokensIn: 145000, tokensOut: 92000, costUsd: 3.12, requestCount: 45 },
  { agent: 'Ralph', model: 'Claude Sonnet 4.6', date: '2026-03-24', tokensIn: 8500, tokensOut: 3200, costUsd: 0.12, requestCount: 5 },
  { agent: 'Claude Bot', model: 'Claude Opus 4.6', date: '2026-03-23', tokensIn: 52000, tokensOut: 31000, costUsd: 1.74, requestCount: 18 },
  { agent: 'Copilot Agent', model: 'GPT-4.1', date: '2026-03-23', tokensIn: 112000, tokensOut: 78000, costUsd: 2.51, requestCount: 38 },
]
