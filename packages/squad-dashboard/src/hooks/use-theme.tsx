import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type Mode = 'light' | 'dark' | 'system'
export type ColorScheme = 'default' | 'ocean' | 'forest' | 'sunset' | 'midnight'

export const COLOR_SCHEMES: Record<ColorScheme, { label: string; preview: { light: string; dark: string } }> = {
  default: { label: 'Default', preview: { light: '#ffffff', dark: '#09090b' } },
  ocean: { label: 'Ocean', preview: { light: '#f0f9ff', dark: '#0c1929' } },
  forest: { label: 'Forest', preview: { light: '#f0fdf4', dark: '#0a1f0e' } },
  sunset: { label: 'Sunset', preview: { light: '#fff7ed', dark: '#1c0f05' } },
  midnight: { label: 'Midnight Purple', preview: { light: '#faf5ff', dark: '#0f0720' } },
}

interface ThemeContextValue {
  mode: Mode
  resolved: 'light' | 'dark'
  colorScheme: ColorScheme
  setMode: (mode: Mode) => void
  setColorScheme: (scheme: ColorScheme) => void
  // Legacy aliases
  theme: Mode
  setTheme: (mode: Mode) => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<Mode>(() => {
    const stored = localStorage.getItem('squad-theme') as Mode | null
    return stored ?? 'system'
  })
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>(() => {
    const stored = localStorage.getItem('squad-color-scheme') as ColorScheme | null
    return stored ?? 'default'
  })

  const resolved = mode === 'system' ? getSystemTheme() : mode

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(resolved)
    // Remove all scheme classes then add active one
    for (const s of Object.keys(COLOR_SCHEMES)) {
      root.classList.remove(`scheme-${s}`)
    }
    root.classList.add(`scheme-${colorScheme}`)
  }, [resolved, colorScheme])

  useEffect(() => {
    if (mode !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => setModeState('system')
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [mode])

  const setMode = (next: Mode) => {
    localStorage.setItem('squad-theme', next)
    setModeState(next)
  }

  const setColorScheme = (next: ColorScheme) => {
    localStorage.setItem('squad-color-scheme', next)
    setColorSchemeState(next)
  }

  return (
    <ThemeContext.Provider value={{
      mode, resolved, colorScheme, setMode, setColorScheme,
      theme: mode, setTheme: setMode,
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
