import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useHealth } from '@/api/hooks'
import { USE_MOCKS, BASE_URL } from '@/api/client'
import { useTheme } from '@/hooks/use-theme'
import { Settings, Server, Palette, Monitor, Sun, Moon, CheckCircle, XCircle, Info } from 'lucide-react'

export function SettingsPage() {
  const health = useHealth()
  const { theme, setTheme } = useTheme()
  const [apiUrl, setApiUrl] = useState(BASE_URL)

  const apiConnected = health.data?.ok === true

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Settings</h2>
        <p className="text-sm text-muted-foreground">Configure dashboard connections and preferences</p>
      </div>

      {/* API Connection */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            <CardTitle className="text-base">API Connection</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground w-24">Status:</span>
            {USE_MOCKS ? (
              <Badge variant="outline" className="text-yellow-400 border-yellow-500/20 bg-yellow-500/10">
                Mock Mode
              </Badge>
            ) : apiConnected ? (
              <Badge variant="outline" className="text-green-400 border-green-500/20 bg-green-500/10 gap-1">
                <CheckCircle className="h-3 w-3" /> Connected
              </Badge>
            ) : (
              <Badge variant="outline" className="text-red-400 border-red-500/20 bg-red-500/10 gap-1">
                <XCircle className="h-3 w-3" /> Offline
              </Badge>
            )}
            {health.data && (
              <span className="text-xs text-muted-foreground">
                Service: {health.data.service}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground w-24">API URL:</span>
            <Input
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="max-w-sm font-mono text-sm"
              placeholder="http://localhost:8790"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground w-24">Data source:</span>
            <span className="text-sm text-foreground font-mono">
              {USE_MOCKS ? 'Mock data (VITE_USE_MOCKS=true)' : `Live API (${BASE_URL})`}
            </span>
          </div>

          <div className="rounded-md bg-accent/50 px-3 py-2 flex items-start gap-2">
            <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground">
              To switch between mock and live data, set <code className="text-foreground">VITE_USE_MOCKS=false</code> in{' '}
              <code className="text-foreground">.env</code> and restart the dev server. The API URL can be configured via{' '}
              <code className="text-foreground">VITE_API_BASE_URL</code>.
            </p>
          </div>

          <Button variant="outline" size="sm" onClick={() => health.refetch()}>
            Test Connection
          </Button>
        </CardContent>
      </Card>

      {/* Theme */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <CardTitle className="text-base">Appearance</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground w-24">Theme:</span>
            <div className="flex gap-2">
              {([['light', Sun], ['dark', Moon], ['system', Monitor]] as const).map(([t, Icon]) => (
                <Button
                  key={t}
                  variant={theme === t ? 'default' : 'outline'}
                  size="sm"
                  className="gap-2"
                  onClick={() => setTheme(t)}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <CardTitle className="text-base">About</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p><strong className="text-foreground">Squad Dashboard</strong> — Self-hosted agent management UI</p>
          <p>Package: <code className="text-foreground">@jerrettdavis/squad</code></p>
          <p>Stack: React + Vite + Tailwind + shadcn/ui</p>
          <p>Pages: 16 | Tests: 17 Playwright BDD</p>
        </CardContent>
      </Card>
    </div>
  )
}
