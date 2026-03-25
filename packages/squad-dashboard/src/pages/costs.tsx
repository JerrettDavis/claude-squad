import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { costHistory } from '@/data/steering-mock'
import { DollarSign, Cpu, TrendingUp, Bot, Zap } from 'lucide-react'

export function CostsPage() {
  const totalCost = costHistory.reduce((sum, e) => sum + e.costUsd, 0)
  const totalTokens = costHistory.reduce((sum, e) => sum + e.tokensIn + e.tokensOut, 0)
  const totalRequests = costHistory.reduce((sum, e) => sum + e.requestCount, 0)

  // Group by agent
  const byAgent = new Map<string, { cost: number; tokens: number; requests: number }>()
  for (const entry of costHistory) {
    const existing = byAgent.get(entry.agent) ?? { cost: 0, tokens: 0, requests: 0 }
    existing.cost += entry.costUsd
    existing.tokens += entry.tokensIn + entry.tokensOut
    existing.requests += entry.requestCount
    byAgent.set(entry.agent, existing)
  }

  // Group by date
  const byDate = new Map<string, { cost: number; tokens: number; requests: number }>()
  for (const entry of costHistory) {
    const existing = byDate.get(entry.date) ?? { cost: 0, tokens: 0, requests: 0 }
    existing.cost += entry.costUsd
    existing.tokens += entry.tokensIn + entry.tokensOut
    existing.requests += entry.requestCount
    byDate.set(entry.date, existing)
  }

  const sortedDates = [...byDate.entries()].sort((a, b) => b[0].localeCompare(a[0]))
  const maxDailyCost = Math.max(...[...byDate.values()].map((v) => v.cost))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Cost Tracking</h2>
        <p className="text-sm text-muted-foreground">Token usage and cost breakdown across agents</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
              <DollarSign className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">${totalCost.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">Total Spend (3 days)</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <Cpu className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{(totalTokens / 1000).toFixed(0)}K</p>
              <p className="text-xs text-muted-foreground">Total Tokens</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
              <TrendingUp className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalRequests}</p>
              <p className="text-xs text-muted-foreground">Total Requests</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Cost by agent */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Cost by Agent</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[...byAgent.entries()]
              .sort((a, b) => b[1].cost - a[1].cost)
              .map(([agent, data]) => (
                <div key={agent} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-foreground">
                      <Bot className="h-3.5 w-3.5" /> {agent}
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      ${data.cost.toFixed(2)}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-accent">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${totalCost > 0 ? (data.cost / totalCost) * 100 : 0}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Cpu className="h-3 w-3" /> {(data.tokens / 1000).toFixed(0)}K tokens
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap className="h-3 w-3" /> {data.requests} requests
                    </span>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>

        {/* Daily cost chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Daily Cost</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sortedDates.map(([date, data]) => (
              <div key={date} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{date}</span>
                  <span className="text-sm font-medium text-foreground">${data.cost.toFixed(2)}</span>
                </div>
                <div className="h-3 rounded-full bg-accent">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-green-500 to-blue-500"
                    style={{ width: `${maxDailyCost > 0 ? (data.cost / maxDailyCost) * 100 : 0}%` }}
                  />
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{(data.tokens / 1000).toFixed(0)}K tokens</span>
                  <span>{data.requests} requests</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Detailed breakdown */}
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-sm font-semibold">Detailed Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="p-0 pt-2">
          <div className="grid grid-cols-7 gap-2 px-4 py-2 text-xs font-medium text-muted-foreground border-b border-border">
            <span>Date</span>
            <span>Agent</span>
            <span>Model</span>
            <span className="text-right">Tokens In</span>
            <span className="text-right">Tokens Out</span>
            <span className="text-right">Cost</span>
            <span className="text-right">Requests</span>
          </div>
          {costHistory.map((entry, i) => (
            <div key={i} className="grid grid-cols-7 gap-2 px-4 py-2 text-sm border-b border-border hover:bg-accent/30 transition-colors">
              <span className="text-muted-foreground">{entry.date}</span>
              <span className="text-foreground">{entry.agent}</span>
              <span className="text-muted-foreground">{entry.model}</span>
              <span className="text-right text-muted-foreground">{entry.tokensIn.toLocaleString()}</span>
              <span className="text-right text-muted-foreground">{entry.tokensOut.toLocaleString()}</span>
              <span className="text-right text-foreground font-medium">${entry.costUsd.toFixed(2)}</span>
              <span className="text-right text-muted-foreground">{entry.requestCount}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
