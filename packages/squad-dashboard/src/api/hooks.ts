import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchIssues, fetchPullRequests, fetchAgents, fetchEvents, fetchHealth,
  fetchAgentConfigs, saveAgentConfig, saveAllAgentConfigs,
  fetchWikiPages, fetchWikiPage, saveWikiPage,
  fetchGitBranches, fetchGitLog,
} from './client'

export function useIssues() {
  return useQuery({ queryKey: ['issues'], queryFn: fetchIssues, refetchInterval: 30_000 })
}

export function usePullRequests() {
  return useQuery({ queryKey: ['pullRequests'], queryFn: fetchPullRequests, refetchInterval: 30_000 })
}

export function useAgents() {
  return useQuery({ queryKey: ['agents'], queryFn: fetchAgents, refetchInterval: 10_000 })
}

export function useEvents() {
  return useQuery({ queryKey: ['events'], queryFn: fetchEvents, refetchInterval: 5_000 })
}

export function useHealth() {
  return useQuery({ queryKey: ['health'], queryFn: fetchHealth, refetchInterval: 60_000, retry: false })
}

export function useAgentConfigs() {
  return useQuery({ queryKey: ['agentConfigs'], queryFn: fetchAgentConfigs, refetchInterval: 30_000 })
}

export function useSaveAgentConfig() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ agentId, config }: { agentId: string; config: Record<string, unknown> }) =>
      saveAgentConfig(agentId, config),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['agentConfigs'] }); qc.invalidateQueries({ queryKey: ['agents'] }) },
  })
}

export function useSaveAllAgentConfigs() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (agents: unknown[]) => saveAllAgentConfigs(agents),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['agentConfigs'] }); qc.invalidateQueries({ queryKey: ['agents'] }) },
  })
}

export function useWikiPages() {
  return useQuery({ queryKey: ['wikiPages'], queryFn: fetchWikiPages, refetchInterval: 60_000 })
}

export function useWikiPage(slug: string | null) {
  return useQuery({
    queryKey: ['wikiPage', slug],
    queryFn: () => slug ? fetchWikiPage(slug) : null,
    enabled: !!slug,
  })
}

export function useSaveWikiPage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ slug, content }: { slug: string; content: string }) => saveWikiPage(slug, content),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['wikiPages'] }),
  })
}

export function useGitBranches() {
  return useQuery({ queryKey: ['gitBranches'], queryFn: fetchGitBranches, refetchInterval: 60_000 })
}

export function useGitLog(limit = 30) {
  return useQuery({ queryKey: ['gitLog', limit], queryFn: () => fetchGitLog(limit), refetchInterval: 30_000 })
}
