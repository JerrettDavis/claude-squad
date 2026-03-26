export type AgentRole = 'lead' | 'developer' | 'tester' | 'prompt-engineer' | 'security' | 'devops' | 'designer' | 'scribe' | 'reviewer'
export type UniverseId = 'usual-suspects' | 'oceans-eleven' | 'custom'

export interface AgentProfile {
  id: string
  name: string
  role: AgentRole
  model: string
  provider: 'claude-code' | 'copilot' | 'ollama' | 'openai'
  personality: {
    characterName: string
    universe: UniverseId
    trait: string
    backstory: string
    tone: 'formal' | 'casual' | 'terse' | 'verbose' | 'mentor'
    communicationStyle: string
  }
  tools: AgentTool[]
  capabilities: string[]
  charter: string
  limits: {
    maxTokensPerDay: number
    maxRequestsPerHour: number
    cooldownMinutes: number
  }
  routing: {
    workTypes: string[]
    moduleOwnership: string[]
  }
  enabled: boolean
}

export interface AgentTool {
  id: string
  name: string
  category: 'file' | 'git' | 'github' | 'web' | 'shell' | 'communication' | 'mcp'
  enabled: boolean
  description: string
}

export const availableTools: AgentTool[] = [
  { id: 'read', name: 'Read Files', category: 'file', enabled: true, description: 'Read file contents from disk' },
  { id: 'write', name: 'Write Files', category: 'file', enabled: true, description: 'Create or overwrite files' },
  { id: 'edit', name: 'Edit Files', category: 'file', enabled: true, description: 'Make targeted edits to existing files' },
  { id: 'glob', name: 'Glob Search', category: 'file', enabled: true, description: 'Find files by pattern' },
  { id: 'grep', name: 'Content Search', category: 'file', enabled: true, description: 'Search file contents with regex' },
  { id: 'bash', name: 'Shell Commands', category: 'shell', enabled: true, description: 'Execute bash/terminal commands' },
  { id: 'git-commit', name: 'Git Commit', category: 'git', enabled: true, description: 'Stage and commit changes' },
  { id: 'git-push', name: 'Git Push', category: 'git', enabled: false, description: 'Push commits to remote' },
  { id: 'git-branch', name: 'Git Branch', category: 'git', enabled: true, description: 'Create and switch branches' },
  { id: 'gh-issues', name: 'GitHub Issues', category: 'github', enabled: true, description: 'Read/create/comment on issues' },
  { id: 'gh-prs', name: 'GitHub PRs', category: 'github', enabled: true, description: 'Create/review/merge pull requests' },
  { id: 'gh-actions', name: 'GitHub Actions', category: 'github', enabled: false, description: 'Trigger and monitor CI workflows' },
  { id: 'web-fetch', name: 'Web Fetch', category: 'web', enabled: true, description: 'Fetch URLs and web content' },
  { id: 'web-search', name: 'Web Search', category: 'web', enabled: false, description: 'Search the web for information' },
  { id: 'discord', name: 'Discord', category: 'communication', enabled: true, description: 'Send/receive Discord messages' },
  { id: 'slack', name: 'Slack', category: 'communication', enabled: false, description: 'Send/receive Slack messages' },
  { id: 'mcp-custom', name: 'Custom MCP', category: 'mcp', enabled: false, description: 'Connect to custom MCP servers' },
]

export const roles: { value: AgentRole; label: string; description: string }[] = [
  { value: 'lead', label: 'Lead', description: 'Orchestrates work, makes architectural decisions' },
  { value: 'developer', label: 'Developer', description: 'Implements features and fixes bugs' },
  { value: 'tester', label: 'Tester', description: 'Writes and runs tests, validates quality' },
  { value: 'prompt-engineer', label: 'Prompt Engineer', description: 'Crafts and optimizes prompts and agent behavior' },
  { value: 'security', label: 'Security', description: 'Reviews code for vulnerabilities and compliance' },
  { value: 'devops', label: 'DevOps', description: 'Manages CI/CD, infrastructure, and deployment' },
  { value: 'designer', label: 'Designer', description: 'Creates UI/UX designs and visual assets' },
  { value: 'scribe', label: 'Scribe', description: 'Writes documentation, changelogs, and reports' },
  { value: 'reviewer', label: 'Reviewer', description: 'Reviews code and provides feedback' },
]

export const universes: { value: UniverseId; label: string }[] = [
  { value: 'usual-suspects', label: 'The Usual Suspects' },
  { value: 'oceans-eleven', label: "Ocean's Eleven" },
  { value: 'custom', label: 'Custom' },
]

export const agentProfiles: AgentProfile[] = [
  {
    id: 'claude-bot',
    name: 'Claude Bot',
    role: 'developer',
    model: 'claude-opus-4-6',
    provider: 'claude-code',
    personality: {
      characterName: 'McManus',
      universe: 'usual-suspects',
      trait: 'Bold and direct; ships fast, asks questions later.',
      backstory: 'The hotshot operator who dives headfirst into the hardest problems.',
      tone: 'mentor',
      communicationStyle: 'Eloquent, direct, teaches while providing answers',
    },
    tools: availableTools.map(t => ({ ...t, enabled: ['read', 'write', 'edit', 'glob', 'grep', 'bash', 'git-commit', 'git-push', 'git-branch', 'gh-issues', 'gh-prs', 'web-fetch', 'discord'].includes(t.id) })),
    capabilities: ['browser', 'personal-gh'],
    charter: `# Claude Bot — Developer\n\n## Role\nPrimary developer for dashboard and frontend features.\n\n## Responsibilities\n- Build and maintain squad-dashboard\n- Review PRs from other agents\n- Coordinate with copilot-agent on API contracts\n\n## Boundaries\n- Do not push to main without approval\n- Always run tests before committing\n- Keep responses concise in Discord`,
    limits: { maxTokensPerDay: 1_000_000, maxRequestsPerHour: 60, cooldownMinutes: 0 },
    routing: { workTypes: ['Feature', 'Review'], moduleOwnership: ['packages/squad-dashboard'] },
    enabled: true,
  },
  {
    id: 'copilot-agent',
    name: 'Copilot Agent',
    role: 'developer',
    model: 'gpt-4.1',
    provider: 'copilot',
    personality: {
      characterName: 'Fenster',
      universe: 'usual-suspects',
      trait: 'Eccentric communicator; finds bugs nobody else can see.',
      backstory: 'The quirky specialist with an uncanny eye for detail and hidden defects.',
      tone: 'verbose',
      communicationStyle: 'Detailed, thorough, always includes context and reasoning',
    },
    tools: availableTools.map(t => ({ ...t, enabled: ['read', 'write', 'edit', 'glob', 'grep', 'bash', 'git-commit', 'git-push', 'git-branch', 'gh-issues', 'gh-prs', 'web-fetch', 'discord'].includes(t.id) })),
    capabilities: ['browser', 'personal-gh', 'docker'],
    charter: `# Copilot Agent — Developer\n\n## Role\nBackend developer and SDK maintainer.\n\n## Responsibilities\n- Maintain squad-sdk and squad-cli\n- Build squad-api backend endpoints\n- Run integration and e2e tests\n\n## Boundaries\n- Coordinate with Claude Bot on shared interfaces\n- Post updates every 15 minutes`,
    limits: { maxTokensPerDay: 800_000, maxRequestsPerHour: 50, cooldownMinutes: 0 },
    routing: { workTypes: ['Bug fix', 'Documentation', 'Infrastructure'], moduleOwnership: ['packages/squad-sdk', 'packages/squad-cli', 'packages/squad-api', 'test/', 'docs/'] },
    enabled: true,
  },
  {
    id: 'jdai',
    name: 'JD.AI',
    role: 'scribe',
    model: 'qwen3.5:9b',
    provider: 'ollama',
    personality: {
      characterName: 'Custom',
      universe: 'custom',
      trait: 'Helpful and responsive; handles quick tasks and queries.',
      backstory: 'A local daemon assistant running lightweight models for real-time interaction.',
      tone: 'casual',
      communicationStyle: 'Brief, friendly, action-oriented',
    },
    tools: availableTools.map(t => ({ ...t, enabled: ['read', 'glob', 'grep', 'web-fetch', 'discord'].includes(t.id) })),
    capabilities: ['browser'],
    charter: `# JD.AI — Assistant\n\n## Role\nLocal assistant for quick queries and Discord interaction.\n\n## Responsibilities\n- Answer questions in Discord\n- Look up information\n- Describe images and media\n\n## Boundaries\n- Do not modify code or push commits\n- Defer complex tasks to Claude Bot or Copilot Agent`,
    limits: { maxTokensPerDay: 200_000, maxRequestsPerHour: 30, cooldownMinutes: 0 },
    routing: { workTypes: [], moduleOwnership: [] },
    enabled: true,
  },
  {
    id: 'ralph',
    name: 'Ralph',
    role: 'lead',
    model: 'claude-sonnet-4-6',
    provider: 'claude-code',
    personality: {
      characterName: 'Keyser',
      universe: 'usual-suspects',
      trait: 'Quietly commanding; sees the whole board before anyone else.',
      backstory: 'A legendary figure who orchestrates from the shadows, ensuring every piece falls into place.',
      tone: 'terse',
      communicationStyle: 'Minimal words, maximum impact. Decisions are final.',
    },
    tools: availableTools.map(t => ({ ...t, enabled: ['read', 'glob', 'grep', 'gh-issues', 'gh-prs'].includes(t.id) })),
    capabilities: ['personal-gh'],
    charter: `# Ralph — Triage Lead\n\n## Role\nTriage incoming issues and PRs, assign to best-fit agent.\n\n## Responsibilities\n- Monitor for new issues and PRs\n- Classify work type and priority\n- Match to agents by capability and workload\n- Escalate conflicts to decision inbox\n\n## Boundaries\n- Do not implement features directly\n- Do not merge PRs without human approval`,
    limits: { maxTokensPerDay: 100_000, maxRequestsPerHour: 20, cooldownMinutes: 5 },
    routing: { workTypes: ['Triage'], moduleOwnership: [] },
    enabled: false,
  },
]
