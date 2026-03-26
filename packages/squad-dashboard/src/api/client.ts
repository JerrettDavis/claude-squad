const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8790'
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false'

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, init)
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`)
  return res.json() as Promise<T>
}

async function apiPut<T>(path: string, body: unknown): Promise<T> {
  return apiFetch<T>(path, {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
}

async function apiPost<T>(path: string, body: unknown): Promise<T> {
  return apiFetch<T>(path, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
}

// --- Types ---

export interface ApiIssue {
  id: number
  number: number
  title: string
  state: 'open' | 'closed'
  labels: Array<{ id: number; name: string; color: string }>
  user: { login: string; id: number }
  html_url: string
  created_at?: string
  updated_at?: string
  comments?: number
  body?: string
  _agenthub?: { priority?: string }
}

export interface ApiPullRequest {
  id: number
  number: number
  title: string
  state: string
  draft: boolean
  user: { login: string; id: number }
  head: { ref: string }
  base: { ref: string }
  html_url: string
  additions?: number
  deletions?: number
  changed_files?: number
  created_at?: string
  updated_at?: string
  comments?: number
  _agenthub?: { steering?: string }
}

export interface ApiAgent {
  id: string
  name?: string
  status: string
  currentTask: string | null
  model?: string
  provider?: string
  role?: string
  uptimeSec?: number
  tokensIn?: number
  tokensOut?: number
  requestCount?: number
  costUsd?: number
  capabilities?: string[]
  enabled?: boolean
}

export interface ApiEvent {
  type: string
  ts: string
  payload: Record<string, unknown>
}

export interface ApiWikiPage {
  slug: string
  title: string
  content: string
  updatedAt?: string
}

export interface ApiGitCommit {
  hash: string
  shortHash: string
  message: string
  author: string
  date: string
  refs: string
}

export interface ApiGitBranch {
  name: string
  upstream?: string
  lastCommitDate: string
  lastCommit: string
  author: string
}

// --- Fetchers ---

export async function fetchIssues(): Promise<ApiIssue[]> {
  if (USE_MOCKS) return []
  return apiFetch<ApiIssue[]>('/api/issues')
}

export async function fetchPullRequests(): Promise<ApiPullRequest[]> {
  if (USE_MOCKS) return []
  return apiFetch<ApiPullRequest[]>('/api/prs')
}

export async function fetchAgents(): Promise<ApiAgent[]> {
  if (USE_MOCKS) return []
  return apiFetch<ApiAgent[]>('/api/agents')
}

export async function fetchEvents(): Promise<ApiEvent[]> {
  if (USE_MOCKS) return []
  const data = await apiFetch<{ events: ApiEvent[] }>('/api/events')
  return data.events
}

export async function fetchHealth(): Promise<{ ok: boolean; service: string; liveGh?: boolean }> {
  return apiFetch('/healthz')
}

// Agent config
export async function fetchAgentConfigs(): Promise<ApiAgent[]> {
  if (USE_MOCKS) return []
  const data = await apiFetch<{ agents: ApiAgent[] }>('/api/agents/config')
  return data.agents
}

export async function saveAgentConfig(agentId: string, config: Record<string, unknown>): Promise<void> {
  await apiPut(`/api/agents/${agentId}/config`, config)
}

export async function saveAllAgentConfigs(agents: unknown[]): Promise<void> {
  await apiPut('/api/agents/config', { agents })
}

// Wiki
export async function fetchWikiPages(): Promise<ApiWikiPage[]> {
  if (USE_MOCKS) return []
  return apiFetch<ApiWikiPage[]>('/api/wiki')
}

export async function fetchWikiPage(slug: string): Promise<ApiWikiPage | null> {
  if (USE_MOCKS) return null
  return apiFetch<ApiWikiPage>(`/api/wiki/${slug}`)
}

export async function saveWikiPage(slug: string, content: string): Promise<void> {
  await apiPut(`/api/wiki/${slug}`, { content })
}

// Git
export async function fetchGitBranches(): Promise<ApiGitBranch[]> {
  if (USE_MOCKS) return []
  return apiFetch<ApiGitBranch[]>('/api/git/branches')
}

export async function fetchGitLog(limit = 30): Promise<ApiGitCommit[]> {
  if (USE_MOCKS) return []
  return apiFetch<ApiGitCommit[]>(`/api/git/log?limit=${limit}`)
}

// Events
export async function postEvent(event: Omit<ApiEvent, 'ts'>): Promise<void> {
  await apiPost('/api/events', event)
}

// SSE stream
export function createEventStream(onEvent: (event: ApiEvent) => void): () => void {
  if (USE_MOCKS) return () => {}
  const es = new EventSource(`${BASE_URL}/api/events/stream`)
  es.addEventListener('message', (e) => {
    try { onEvent(JSON.parse(e.data)); } catch { /* ignore */ }
  })
  return () => es.close()
}

export { USE_MOCKS, BASE_URL }
