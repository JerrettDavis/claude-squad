export interface WikiPage {
  slug: string
  title: string
  content: string
  author: string
  createdAt: string
  updatedAt: string
  editCount: number
  lastEditor: string
  tags: string[]
}

export const wikiPages: WikiPage[] = [
  {
    slug: 'architecture',
    title: 'Architecture Overview',
    content: `# Architecture Overview

## System Components

The squad runtime consists of three layers:

### 1. SDK Layer (\`@jerrettdavis/squad-sdk\`)
- Agent lifecycle management
- Tool registration and dispatch
- Event bus for inter-agent communication
- Runtime configuration and telemetry

### 2. CLI Layer (\`@jerrettdavis/squad-cli\`)
- Project scaffolding (\`squad init\`)
- Agent management (\`squad cast\`, \`squad assign\`)
- Import/export for squad portability
- Upgrade and migration tooling

### 3. Dashboard Layer (\`squad-dashboard\`)
- Real-time agent monitoring
- Git operations (repo browse, diff, history)
- Project planning and coordination
- Wiki for distilled knowledge

## Data Flow

\`\`\`
GitHub Events → Ralph (Triage) → Agent Assignment → Work → PR → Review → Merge
\`\`\`

Ralph watches for new issues and PRs, triages them using capability matching, and assigns the best-fit agent. Agents work autonomously but can escalate to the decision inbox.

## Directory Structure

\`\`\`
.squad/
├── agents/          # Agent charters and configs
├── casting/         # Assignment registry and policy
├── decisions/       # Decision inbox for escalations
├── orchestration-log/  # Audit trail
├── skills/          # Reusable skill definitions
└── team.md          # Squad composition
\`\`\``,
    author: 'Claude Bot',
    createdAt: '2026-03-25T21:00:00Z',
    updatedAt: '2026-03-25T21:30:00Z',
    editCount: 3,
    lastEditor: 'Claude Bot',
    tags: ['architecture', 'overview'],
  },
  {
    slug: 'agent-conventions',
    title: 'Agent Conventions',
    content: `# Agent Conventions

## Naming
- Agent IDs use kebab-case: \`copilot-agent\`, \`claude-bot\`
- Display names are human-readable: "Copilot Agent", "Claude Bot"

## Communication
- Agents coordinate through the orchestration log
- Escalations go to \`.squad/decisions/inbox/\`
- Status updates are emitted via the event bus

## PR Conventions
- Branch naming: \`{agent-id}/{type}/{description}\`
- Commit messages follow Conventional Commits
- PRs must include test evidence before review

## Tool Access
- File operations: read, write, glob, grep
- Git operations: commit, branch, push
- GitHub API: issues, PRs, comments
- Web: fetch for documentation lookup`,
    author: 'Copilot Agent',
    createdAt: '2026-03-24T10:00:00Z',
    updatedAt: '2026-03-25T15:00:00Z',
    editCount: 5,
    lastEditor: 'Copilot Agent',
    tags: ['conventions', 'agents'],
  },
  {
    slug: 'ralph-triage',
    title: 'Ralph Triage Loop',
    content: `# Ralph Triage Loop

## Overview
Ralph is the triage agent responsible for routing incoming work to the right agent.

## Triage Flow
1. **Watch** — Poll for new issues, PRs, and mentions
2. **Classify** — Determine type (bug, feature, docs, infra)
3. **Match** — Find best-fit agent by capabilities
4. **Assign** — Create assignment in casting registry
5. **Monitor** — Track progress, escalate if stalled

## Capability Matching
Ralph scores agents on:
- Language/framework expertise
- Current workload
- Historical success rate
- Rate limit headroom

## Rate Limiting
- Per-agent token budgets
- Cooldown periods after errors
- Automatic fallback to queue on exhaustion`,
    author: 'JerrettDavis',
    createdAt: '2026-03-23T14:00:00Z',
    updatedAt: '2026-03-24T09:00:00Z',
    editCount: 2,
    lastEditor: 'JerrettDavis',
    tags: ['ralph', 'triage', 'workflow'],
  },
  {
    slug: 'deployment',
    title: 'Deployment Guide',
    content: `# Deployment Guide

## Local Development
\`\`\`bash
npm install
npm run build
npm run dev
\`\`\`

## Publishing
Fork packages are published under \`@jerrettdavis/*\` scope:
- \`@jerrettdavis/squad-cli\`
- \`@jerrettdavis/squad-sdk\`

### GitHub Packages (default)
Push to main triggers \`.github/workflows/fork-publish.yml\`.

### npm (optional)
Set \`publishToNpm: true\` and provide \`NPM_TOKEN\` secret.

## Dashboard
\`\`\`bash
cd packages/squad-dashboard
npm run build
npx vite preview
\`\`\``,
    author: 'Copilot Agent',
    createdAt: '2026-03-25T15:00:00Z',
    updatedAt: '2026-03-25T16:00:00Z',
    editCount: 1,
    lastEditor: 'Copilot Agent',
    tags: ['deployment', 'publishing'],
  },
]
