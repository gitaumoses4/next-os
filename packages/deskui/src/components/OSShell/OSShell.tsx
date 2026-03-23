'use client'

import { useMemo, useState, useEffect, useCallback } from 'react'
import type { AppDefinition, DeepPartial } from '@/types'
import type { OSTheme } from '@/themes/types'
import { macosTheme } from '@/themes/macos'
import { windows11Theme } from '@/themes/windows11'
import { ubuntuTheme } from '@/themes/ubuntu'
import { mergeTheme } from '@/utils/mergeTheme'
import { themeToVars } from '@/utils/themeVars'
import { OSProvider } from '@/context/OSProvider'
import { WindowManager } from '@/components/WindowManager'
import { Desktop } from '@/components/Desktop'
import { Dock } from '@/components/Dock'
import { Taskbar } from '@/components/Taskbar'
import { ModeToggle } from '@/components/OSShell/ModeToggle'
import '@/styles.css'

const builtInThemes: Record<string, OSTheme> = {
  macos: macosTheme,
  windows11: windows11Theme,
  ubuntu: ubuntuTheme,
}

const STORAGE_KEY = 'deskui-mode'

export interface OSShellProps {
  apps: AppDefinition[]
  theme?: 'macos' | 'windows11' | 'ubuntu' | OSTheme | DeepPartial<OSTheme>
  wallpaper?: string
  taskbarVariant?: 'dock' | 'taskbar'
  initialWindows?: string[]
  defaultMode?: 'desktop' | 'web'
  onWindowOpen?: (appId: string) => void
  onWindowClose?: (windowId: string) => void
  onWindowFocus?: (windowId: string) => void
  onModeChange?: (mode: 'desktop' | 'web') => void
  children: React.ReactNode
}

function resolveTheme(theme: OSShellProps['theme']): OSTheme {
  if (!theme) return macosTheme

  if (typeof theme === 'string') {
    return builtInThemes[theme] ?? macosTheme
  }

  if ('name' in theme && theme.name && typeof theme.name === 'string') {
    if (
      'windowChrome' in theme &&
      'dock' in theme &&
      'taskbar' in theme &&
      'desktop' in theme &&
      'animation' in theme &&
      'tokens' in theme
    ) {
      return theme as OSTheme
    }
  }

  return mergeTheme(macosTheme, theme as DeepPartial<OSTheme>)
}

export function OSShell({
  apps,
  theme: themeProp,
  wallpaper,
  taskbarVariant = 'dock',
  initialWindows,
  defaultMode = 'desktop',
  onWindowOpen,
  onWindowClose,
  onWindowFocus,
  onModeChange,
  children,
}: OSShellProps) {
  const [isIframe, setIsIframe] = useState<boolean | null>(null)
  const [mode, setMode] = useState<'desktop' | 'web'>(defaultMode)

  useEffect(() => {
    setIsIframe(window.self !== window.top)
    const saved = localStorage.getItem(STORAGE_KEY) as 'desktop' | 'web' | null
    if (saved) setMode(saved)
  }, [])

  const toggleMode = useCallback(() => {
    setMode((prev) => {
      const next = prev === 'desktop' ? 'web' : 'desktop'
      localStorage.setItem(STORAGE_KEY, next)
      onModeChange?.(next)
      return next
    })
  }, [onModeChange])

  // Keyboard shortcut: Ctrl/Cmd + Shift + D
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault()
        toggleMode()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [toggleMode])

  const theme = useMemo(() => resolveTheme(themeProp), [themeProp])
  const cssVars = useMemo(() => themeToVars(theme), [theme])

  // Still detecting context — render nothing to prevent flash
  if (isIframe === null) {
    return null
  }

  // Inside an iframe — render children only
  if (isIframe) {
    return <>{children}</>
  }

  // Web mode — render children normally
  if (mode === 'web') {
    return (
      <>
        {children}
        <ModeToggle mode={mode} onToggle={toggleMode} />
      </>
    )
  }

  // Desktop mode
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        fontFamily: theme.tokens['font-family'] ?? 'system-ui, sans-serif',
        ...cssVars,
      }}
    >
      <OSProvider
        apps={apps}
        theme={theme}
        taskbarVariant={taskbarVariant}
        wallpaper={wallpaper}
        initialWindows={initialWindows}
        onWindowOpen={onWindowOpen}
        onWindowClose={onWindowClose}
        onWindowFocus={onWindowFocus}
      >
        <Desktop />
        <WindowManager />
        {taskbarVariant === 'dock' ? <Dock /> : <Taskbar />}
        <ModeToggle mode={mode} onToggle={toggleMode} />
        {children}
      </OSProvider>
    </div>
  )
}
