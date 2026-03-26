import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/hooks/use-theme'
import { AppLayout } from '@/components/layout/app-layout'
import { OverviewPage } from '@/pages/overview'
import { AgentsPage } from '@/pages/agents'
import { IssuesPage } from '@/pages/issues'
import { PullsPage } from '@/pages/pulls'
import { ActivityPage } from '@/pages/activity'
import { RepoPage } from '@/pages/repo'
import { BranchesPage } from '@/pages/branches'
import { HistoryPage } from '@/pages/history'
import { WikiPage } from '@/pages/wiki'
import { ProjectsPage } from '@/pages/projects'
import { TriagePage } from '@/pages/triage'
import { OrchestrationPage } from '@/pages/orchestration'
import { DecisionsPage } from '@/pages/decisions'
import { SteeringPage } from '@/pages/steering'
import { CostsPage } from '@/pages/costs'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10_000,
      retry: 1,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<OverviewPage />} />
              <Route path="/agents" element={<AgentsPage />} />
              <Route path="/issues" element={<IssuesPage />} />
              <Route path="/pulls" element={<PullsPage />} />
              <Route path="/activity" element={<ActivityPage />} />
              <Route path="/repo" element={<RepoPage />} />
              <Route path="/branches" element={<BranchesPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/wiki" element={<WikiPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/triage" element={<TriagePage />} />
              <Route path="/orchestration" element={<OrchestrationPage />} />
              <Route path="/decisions" element={<DecisionsPage />} />
              <Route path="/steering" element={<SteeringPage />} />
              <Route path="/costs" element={<CostsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
