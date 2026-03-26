const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8790'
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false'

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`)
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`)
  return res.json() as Promise<T>
}

// --- GitHub-shaped types from squad-api ---

export interface ApiIssue {
  id: number
  number: number
  title: string
  state: 'open' | 'closed'
  labels: Array<{ id: number; name: string; color: string }>
  user: { login: string; id: number }
  html_url: string
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
  _agenthub?: { steering?: string }
}

export interface ApiAgent {
  id: string
  status: string
  currentTask: string | null
}

export interface ApiEvent {
  type: string
  ts: string
  payload: Record<string, unknown>
}

// --- Fetchers (return mock fallback when API unreachable and USE_MOCKS=true) ---

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

export async function fetchHealth(): Promise<{ ok: boolean; service: string }> {
  return apiFetch('/healthz')
}

export { USE_MOCKS, BASE_URL }
