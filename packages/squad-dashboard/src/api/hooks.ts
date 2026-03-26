import { useQuery } from '@tanstack/react-query'
import { fetchIssues, fetchPullRequests, fetchAgents, fetchEvents, fetchHealth } from './client'

export function useIssues() {
  return useQuery({
    queryKey: ['issues'],
    queryFn: fetchIssues,
    refetchInterval: 30_000,
  })
}

export function usePullRequests() {
  return useQuery({
    queryKey: ['pullRequests'],
    queryFn: fetchPullRequests,
    refetchInterval: 30_000,
  })
}

export function useAgents() {
  return useQuery({
    queryKey: ['agents'],
    queryFn: fetchAgents,
    refetchInterval: 10_000,
  })
}

export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
    refetchInterval: 5_000,
  })
}

export function useHealth() {
  return useQuery({
    queryKey: ['health'],
    queryFn: fetchHealth,
    refetchInterval: 60_000,
    retry: false,
  })
}
