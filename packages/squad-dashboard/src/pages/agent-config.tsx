import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { agentProfiles, availableTools, roles, universes } from '@/data/agent-config-mock'
import type { AgentProfile, AgentTool } from '@/data/agent-config-mock'
import {
  Bot, Plus, Settings, User, Wrench, Shield, FileText,
  Zap, ToggleLeft, ToggleRight, ChevronRight, Pencil,
  Trash2, Copy, Power, PowerOff,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const providerColors: Record<string, string> = {
  'claude-code': 'text-orange-400 border-orange-500/20 bg-orange-500/10',
  copilot: 'text-blue-400 border-blue-500/20 bg-blue-500/10',
  ollama: 'text-green-400 border-green-500/20 bg-green-500/10',
  openai: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/10',
}

const toneLabels: Record<string, string> = {
  formal: 'Formal & Professional',
  casual: 'Casual & Friendly',
  terse: 'Terse & Minimal',
  verbose: 'Verbose & Detailed',
  mentor: 'Mentor & Teaching',
}

function ToolToggle({ tool, onToggle }: { tool: AgentTool; onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3">
        <button onClick={onToggle}>
          {tool.enabled ? (
            <ToggleRight className="h-5 w-5 text-green-500" />
          ) : (
            <ToggleLeft className="h-5 w-5 text-muted-foreground" />
          )}
        </button>
        <div>
          <span className={cn('text-sm font-medium', tool.enabled ? 'text-foreground' : 'text-muted-foreground')}>
            {tool.name}
          </span>
          <p className="text-xs text-muted-foreground">{tool.description}</p>
        </div>
      </div>
      <Badge variant="outline" className="text-[10px]">{tool.category}</Badge>
    </div>
  )
}

function AgentDetailPanel({ agent }: { agent: AgentProfile }) {
  const [tools, setTools] = useState(agent.tools)

  const toggleTool = (toolId: string) => {
    setTools(prev => prev.map(t => t.id === toolId ? { ...t, enabled: !t.enabled } : t))
  }

  const enabledTools = tools.filter(t => t.enabled).length
  const toolCategories = [...new Set(tools.map(t => t.category))]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">{agent.name}</h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={providerColors[agent.provider]}>
                {agent.provider}
              </Badge>
              <span className="text-xs text-muted-foreground">{agent.model}</span>
              <Badge variant="outline" className="text-[10px]">
                {roles.find(r => r.value === agent.role)?.label}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant={agent.enabled ? 'outline' : 'default'} size="sm" className="gap-2">
            {agent.enabled ? <PowerOff className="h-3.5 w-3.5" /> : <Power className="h-3.5 w-3.5" />}
            {agent.enabled ? 'Disable' : 'Enable'}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8"><Copy className="h-3.5 w-3.5" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
        </div>
      </div>

      <Tabs defaultValue="personality">
        <TabsList>
          <TabsTrigger value="personality" className="gap-1.5"><User className="h-3.5 w-3.5" /> Personality</TabsTrigger>
          <TabsTrigger value="tools" className="gap-1.5"><Wrench className="h-3.5 w-3.5" /> Tools ({enabledTools})</TabsTrigger>
          <TabsTrigger value="charter" className="gap-1.5"><FileText className="h-3.5 w-3.5" /> Charter</TabsTrigger>
          <TabsTrigger value="limits" className="gap-1.5"><Shield className="h-3.5 w-3.5" /> Limits & Routing</TabsTrigger>
        </TabsList>

        <TabsContent value="personality">
          <Card>
            <CardContent className="pt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Character Name</label>
                  <Input defaultValue={agent.personality.characterName} className="mt-1" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Universe</label>
                  <select
                    defaultValue={agent.personality.universe}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {universes.map(u => (
                      <option key={u.value} value={u.value}>{u.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Personality Trait</label>
                <Input defaultValue={agent.personality.trait} className="mt-1" />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Backstory</label>
                <Textarea defaultValue={agent.personality.backstory} className="mt-1" rows={3} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Tone</label>
                  <select
                    defaultValue={agent.personality.tone}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {Object.entries(toneLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Role</label>
                  <select
                    defaultValue={agent.role}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {roles.map(r => (
                      <option key={r.value} value={r.value}>{r.label} — {r.description}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Communication Style</label>
                <Input defaultValue={agent.personality.communicationStyle} className="mt-1" />
              </div>

              <Button size="sm">Save Personality</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tools">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                  {enabledTools} of {tools.length} tools enabled
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setTools(prev => prev.map(t => ({ ...t, enabled: true })))}>
                    Enable All
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setTools(prev => prev.map(t => ({ ...t, enabled: false })))}>
                    Disable All
                  </Button>
                </div>
              </div>
              {toolCategories.map(cat => (
                <div key={cat}>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mt-4 mb-2">
                    {cat}
                  </p>
                  {tools.filter(t => t.category === cat).map(tool => (
                    <ToolToggle key={tool.id} tool={tool} onToggle={() => toggleTool(tool.id)} />
                  ))}
                </div>
              ))}
              <Separator className="my-4" />
              <Button size="sm">Save Tool Configuration</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="charter">
          <Card>
            <CardContent className="pt-4 space-y-4">
              <Textarea
                defaultValue={agent.charter}
                className="font-mono text-sm min-h-[300px]"
                rows={15}
              />
              <p className="text-xs text-muted-foreground">
                Markdown format. Defines the agent's role, responsibilities, and boundaries.
                This is injected into the agent's system prompt at spawn time.
              </p>
              <Button size="sm">Save Charter</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="limits">
          <Card>
            <CardContent className="pt-4 space-y-6">
              <div>
                <p className="text-sm font-medium text-foreground mb-3">Rate Limits</p>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Max Tokens/Day</label>
                    <Input type="number" defaultValue={agent.limits.maxTokensPerDay} className="mt-1" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Max Requests/Hour</label>
                    <Input type="number" defaultValue={agent.limits.maxRequestsPerHour} className="mt-1" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Cooldown (minutes)</label>
                    <Input type="number" defaultValue={agent.limits.cooldownMinutes} className="mt-1" />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium text-foreground mb-3">Routing</p>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Work Types (comma-separated)</label>
                    <Input defaultValue={agent.routing.workTypes.join(', ')} className="mt-1" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Module Ownership (paths)</label>
                    <Input defaultValue={agent.routing.moduleOwnership.join(', ')} className="mt-1 font-mono" />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Capabilities</label>
                <div className="flex gap-2 mt-1 flex-wrap">
                  {agent.capabilities.map(cap => (
                    <Badge key={cap} variant="outline" className="gap-1">
                      {cap}
                      <button className="ml-1 text-muted-foreground hover:text-destructive">×</button>
                    </Badge>
                  ))}
                  <Button variant="outline" size="sm" className="h-6 text-xs gap-1">
                    <Plus className="h-3 w-3" /> Add
                  </Button>
                </div>
              </div>

              <Button size="sm">Save Limits & Routing</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export function AgentConfigPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selectedAgent = agentProfiles.find(a => a.id === selectedId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Agent Configuration</h2>
          <p className="text-sm text-muted-foreground">
            Manage agent profiles, personalities, tools, and limits
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="h-3.5 w-3.5" /> New Agent
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Agent list */}
        <div className="col-span-1 space-y-2">
          {agentProfiles.map(agent => (
            <button
              key={agent.id}
              onClick={() => setSelectedId(agent.id)}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all',
                selectedId === agent.id
                  ? 'border-primary bg-accent ring-1 ring-primary/20'
                  : 'border-border hover:border-foreground/20'
              )}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                <Bot className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground truncate">{agent.name}</span>
                  {!agent.enabled && (
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-500" />
                  )}
                  {agent.enabled && (
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  )}
                </div>
                <span className="text-xs text-muted-foreground">{agent.model}</span>
              </div>
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
            </button>
          ))}
        </div>

        {/* Agent detail */}
        <div className="col-span-3">
          {selectedAgent ? (
            <AgentDetailPanel agent={selectedAgent} />
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Settings className="h-8 w-8 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">Select an agent to configure</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {agentProfiles.length} agents configured, {agentProfiles.filter(a => a.enabled).length} enabled
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
