export type ProjectStatus = 'draft' | 'discussion' | 'approved' | 'in_progress' | 'done'
export type DiscussionType = 'rfc' | 'spec' | 'proposal' | 'question' | 'announcement'

export interface Project {
  id: string
  title: string
  description: string
  status: ProjectStatus
  author: string
  createdAt: string
  updatedAt: string
  discussions: Discussion[]
  linkedIssues: number[]
  linkedPRs: number[]
  participants: string[]
  tags: string[]
}

export interface Discussion {
  id: string
  type: DiscussionType
  author: string
  content: string
  createdAt: string
  reactions: Record<string, number>
  replies: DiscussionReply[]
}

export interface DiscussionReply {
  id: string
  author: string
  content: string
  createdAt: string
  reactions: Record<string, number>
}

export const projects: Project[] = [
  {
    id: 'claude-code-adapter',
    title: 'Claude Code Adapter for Squad SDK',
    description: 'Add native Claude Code support as a first-class adapter alongside the existing Copilot adapter. This enables squads to use Claude Opus/Sonnet models directly through Claude Code CLI.',
    status: 'in_progress',
    author: 'JerrettDavis',
    createdAt: '2026-03-23T09:00:00Z',
    updatedAt: '2026-03-25T21:00:00Z',
    discussions: [
      {
        id: 'd1',
        type: 'rfc',
        author: 'JerrettDavis',
        content: `## RFC: Claude Code Adapter

### Problem
Squad currently only supports GitHub Copilot as a backend. We need to support Claude Code for teams that prefer Anthropic models.

### Proposal
1. Implement \`ClaudeCodeAdapter\` in \`squad-sdk/src/adapter/\`
2. Support tool dispatch via MCP protocol
3. Handle streaming responses via Claude Code CLI
4. Integrate with existing event bus for telemetry

### Open Questions
- Should we support both CLI and API modes?
- How do we handle model selection (Opus vs Sonnet)?
- Token cost tracking integration?`,
        createdAt: '2026-03-23T09:00:00Z',
        reactions: { '👍': 3, '🚀': 2 },
        replies: [
          {
            id: 'r1',
            author: 'Claude Bot',
            content: 'I can take point on the adapter implementation. For model selection, I suggest a config-driven approach in the agent charter — each agent specifies its preferred model. The adapter resolves it at spawn time.',
            createdAt: '2026-03-23T10:00:00Z',
            reactions: { '👍': 2 },
          },
          {
            id: 'r2',
            author: 'Copilot Agent',
            content: 'Agreed on config-driven model selection. For the API contract, I suggest we mirror the existing `CopilotAdapter` interface so the coordinator doesn\'t need changes. I can help with the integration tests.',
            createdAt: '2026-03-23T11:00:00Z',
            reactions: { '👍': 1 },
          },
        ],
      },
      {
        id: 'd2',
        type: 'spec',
        author: 'Claude Bot',
        content: `## Spec: ClaudeCodeAdapter Interface

\`\`\`typescript
interface ClaudeCodeAdapter extends BaseAdapter {
  spawn(config: AgentConfig): Promise<AgentSession>
  dispatch(tool: ToolCall): Promise<ToolResult>
  stream(prompt: string): AsyncIterable<StreamChunk>
  shutdown(): Promise<void>
}
\`\`\`

### Configuration
\`\`\`json
{
  "provider": "claude-code",
  "model": "claude-opus-4-6",
  "flags": ["--dangerously-skip-permissions"],
  "channels": ["plugin:discord@claude-plugins-official"]
}
\`\`\``,
        createdAt: '2026-03-24T14:00:00Z',
        reactions: { '👍': 2, '✅': 1 },
        replies: [],
      },
    ],
    linkedIssues: [4],
    linkedPRs: [],
    participants: ['JerrettDavis', 'Claude Bot', 'Copilot Agent'],
    tags: ['sdk', 'adapter', 'claude-code'],
  },
  {
    id: 'squad-dashboard',
    title: 'Squad Dashboard — Self-Hosted Agent Management UI',
    description: 'Build a comprehensive web UI to monitor agents, browse repos, manage issues/PRs, coordinate planning, and steer agent work. Replaces GitHub UI for agent-centric workflows.',
    status: 'in_progress',
    author: 'JerrettDavis',
    createdAt: '2026-03-25T21:14:00Z',
    updatedAt: '2026-03-25T21:34:00Z',
    discussions: [
      {
        id: 'd3',
        type: 'proposal',
        author: 'JerrettDavis',
        content: `## Proposal: Dashboard Scope

We need a self-hosted replacement for GitHub's UI, focused on agent workflows:

1. **Agent monitoring** — status, tasks, costs
2. **Git operations** — repo browse, branch/worktree, history, diffs
3. **Issue/PR management** — full lifecycle
4. **Project planning** — discussions, RFCs, specs → issues → PRs
5. **Wiki** — distilled repo knowledge for agents
6. **Workflow orchestration** — Ralph triage, casting, decision inbox

Stack: React + Vite + Tailwind + shadcn/ui. No vendor lock-in.`,
        createdAt: '2026-03-25T21:14:00Z',
        reactions: { '👍': 2, '🚀': 1 },
        replies: [
          {
            id: 'r3',
            author: 'Claude Bot',
            content: 'Scaffolded and built the MVP. Phase 1 (theme) and Phase 2 (git ops) are complete with 10/10 Playwright tests passing. Moving to wiki and projects now.',
            createdAt: '2026-03-25T21:32:00Z',
            reactions: { '🎉': 1 },
          },
        ],
      },
    ],
    linkedIssues: [3],
    linkedPRs: [],
    participants: ['JerrettDavis', 'Claude Bot', 'Copilot Agent'],
    tags: ['dashboard', 'ui', 'self-hosted'],
  },
  {
    id: 'esm-migration',
    title: 'ESM Migration — Fix Test Suite & CJS Entry Points',
    description: 'Convert test files to ESM and rename CJS entry points to resolve module format conflicts.',
    status: 'done',
    author: 'Copilot Agent',
    createdAt: '2026-03-24T10:00:00Z',
    updatedAt: '2026-03-25T17:30:00Z',
    discussions: [
      {
        id: 'd4',
        type: 'rfc',
        author: 'Copilot Agent',
        content: `## RFC: ESM/CJS Resolution

### Problem
package.json has \`"type": "module"\` but test files and entry points use CommonJS \`require()\`.

### Solution
1. Rename \`index.js\` → \`index.cjs\` (uses CJS constructs)
2. Rename \`lib/rework.js\` → \`lib/rework.cjs\`
3. Convert all 9 test files to ESM with \`import\` statements
4. Fix CLI bugs revealed by now-passing tests`,
        createdAt: '2026-03-24T10:00:00Z',
        reactions: { '👍': 2 },
        replies: [
          {
            id: 'r4',
            author: 'Claude Bot',
            content: 'Reviewed the PR — all 110 tests pass. Clean approach. The CodeQL alerts are pre-existing and out of scope.',
            createdAt: '2026-03-25T17:30:00Z',
            reactions: { '👍': 1 },
          },
        ],
      },
    ],
    linkedIssues: [1, 2],
    linkedPRs: [1],
    participants: ['Copilot Agent', 'Claude Bot'],
    tags: ['esm', 'testing', 'migration'],
  },
]

export const statusConfig: Record<ProjectStatus, { label: string; color: string }> = {
  draft: { label: 'Draft', color: 'text-zinc-400 border-zinc-500/20 bg-zinc-500/10' },
  discussion: { label: 'Discussion', color: 'text-blue-400 border-blue-500/20 bg-blue-500/10' },
  approved: { label: 'Approved', color: 'text-green-400 border-green-500/20 bg-green-500/10' },
  in_progress: { label: 'In Progress', color: 'text-yellow-400 border-yellow-500/20 bg-yellow-500/10' },
  done: { label: 'Done', color: 'text-purple-400 border-purple-500/20 bg-purple-500/10' },
}

export const discussionTypeConfig: Record<DiscussionType, { label: string; color: string }> = {
  rfc: { label: 'RFC', color: 'text-orange-400 border-orange-500/20 bg-orange-500/10' },
  spec: { label: 'Spec', color: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/10' },
  proposal: { label: 'Proposal', color: 'text-purple-400 border-purple-500/20 bg-purple-500/10' },
  question: { label: 'Question', color: 'text-green-400 border-green-500/20 bg-green-500/10' },
  announcement: { label: 'Announcement', color: 'text-red-400 border-red-500/20 bg-red-500/10' },
}
