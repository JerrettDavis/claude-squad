import { AgentCard } from '@/components/agent-card'
import { agents } from '@/data/mock'

export function AgentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Agents</h2>
        <p className="text-sm text-muted-foreground">
          {agents.filter((a) => a.status === 'active').length} active,{' '}
          {agents.filter((a) => a.status === 'idle').length} idle,{' '}
          {agents.filter((a) => a.status === 'offline').length} offline
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  )
}
