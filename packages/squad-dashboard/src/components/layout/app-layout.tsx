import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './sidebar'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex h-14 items-center gap-3 border-b border-border bg-card px-4">
        <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        <span className="text-sm font-semibold text-foreground">Squad Dashboard</span>
      </div>

      {/* Sidebar overlay on mobile */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className={`lg:block ${mobileOpen ? 'block' : 'hidden'}`}>
        <Sidebar onNavigate={() => setMobileOpen(false)} />
      </div>

      <main className="lg:ml-64 min-h-screen p-4 pt-18 lg:p-6 lg:pt-6">
        <Outlet />
      </main>
    </div>
  )
}
