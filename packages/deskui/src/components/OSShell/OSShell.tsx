'use client'

import { useMemo, useState, useEffect, useCallback } from 'react'
import type { AppDefinition, DeepPartial, DockEntry } from '@/types'
import type { OSTheme } from '@/themes/types'
import { defaultTheme } from '@/themes/default'
import { mergeTheme } from '@/utils/mergeTheme'
import { themeToVars } from '@/utils/themeVars'
import { OSProvider } from '@/context/OSProvider'
import { useOSStore } from '@/store/windowStore'
import { WindowManager } from '@/components/WindowManager'
import { Desktop } from '@/components/Desktop'
import { Dock } from '@/components/Dock'
import { Taskbar } from '@/components/Taskbar'
import { ModeToggle } from '@/components/OSShell/ModeToggle'
import { CommandPalette } from '@/components/CommandPalette'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { SnapPreview } from '@/components/SnapPreview'
import { WindowSwitcher } from '@/components/WindowSwitcher'
import { useBridgeListener } from '@/hooks/useBridgeListener'
import { usePersistedLayout } from '@/hooks/usePersistedLayout'
import { ToastContainer, NotificationPanel } from '@/components/Notification'
import { MissionControl } from '@/components/MissionControl'
import { MenuBar } from '@/components/MenuBar'
import { LockScreen } from '@/components/LockScreen'
import '@/styles.css'

const STORAGE_KEY = 'deskui-mode'

export interface OSShellProps {
  apps: AppDefinition[]
  theme?: OSTheme | DeepPartial<OSTheme>
  wallpaper?: string | string[] | (() => string)
  taskbarVariant?: 'dock' | 'taskbar'
  dockItems?: DockEntry[]
  initialWindows?: string[]
  defaultMode?: 'desktop' | 'web'
  persistLayout?: boolean
  lockScreen?: boolean | { idleTimeout: number }
  onWindowOpen?: (appId: string) => void
  onWindowClose?: (windowId: string) => void
  onWindowFocus?: (windowId: string) => void
  onModeChange?: (mode: 'desktop' | 'web') => void
  children: React.ReactNode
}

function resolveTheme(theme: OSShellProps['theme']): OSTheme {
  if (!theme) return defaultTheme

  // Full theme object
  if (
    'name' in theme &&
    'windowChrome' in theme &&
    'dock' in theme &&
    'taskbar' in theme &&
    'desktop' in theme &&
    'animation' in theme &&
    'tokens' in theme
  ) {
    return theme as OSTheme
  }

  // Partial override — merge with default
  return mergeTheme(defaultTheme, theme as DeepPartial<OSTheme>)
}

export function OSShell({
  apps,
  theme: themeProp,
  wallpaper,
  taskbarVariant = 'dock',
  dockItems,
  initialWindows,
  defaultMode = 'desktop',
  persistLayout = false,
  lockScreen = false,
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

  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const toggleCommandPalette = useCallback(() => setCommandPaletteOpen((v) => !v), [])

  const showDesktop = useOSStore((s) => s.showDesktop)
  const toggleMissionControl = useOSStore((s) => s.toggleMissionControl)

  // Keyboard shortcuts: Ctrl/Cmd+Shift+D, Ctrl/Cmd+D, F3 (Mission Control)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault()
        toggleMode()
      }
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === 'd') {
        e.preventDefault()
        showDesktop()
      }
      if (e.key === 'F3') {
        e.preventDefault()
        toggleMissionControl()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [toggleMode, showDesktop, toggleMissionControl])

  const theme = useMemo(() => resolveTheme(themeProp), [themeProp])
  const cssVars = useMemo(() => themeToVars(theme), [theme])

  // Window management shortcuts: Ctrl/Cmd+W, M, Tab, K, etc.
  // Dock mode: menu bar at top. Taskbar mode: taskbar at top/bottom.
  const reservedSpace =
    taskbarVariant === 'taskbar'
      ? { height: theme.taskbar.height, position: theme.taskbar.position }
      : { height: theme.menuBar.height, position: 'top' as const }
  useKeyboardShortcuts({
    apps,
    reservedSpace,
    onToggleCommandPalette: toggleCommandPalette,
  })

  // Listen for postMessage from iframe windows
  useBridgeListener()
  usePersistedLayout(persistLayout)

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
        <ModeToggle mode={mode} onToggle={toggleMode} themeTokens={theme.modeToggle} />
      </>
    )
  }

  // Desktop mode
  return (
    <div
      role="application"
      aria-label="Desktop"
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
        <SnapPreview />
        <WindowManager />
        {taskbarVariant === 'dock' && (
          <MenuBar onToggleCommandPalette={() => setCommandPaletteOpen((v) => !v)} />
        )}
        {taskbarVariant === 'dock' ? <Dock dockItems={dockItems} /> : <Taskbar />}
        <WindowSwitcher />
        <ModeToggle mode={mode} onToggle={toggleMode} themeTokens={theme.modeToggle} />
        <CommandPalette open={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
        <MissionControl />
        <ToastContainer />
        <NotificationPanel />
        {lockScreen && (
          <LockScreen
            idleTimeout={typeof lockScreen === 'object' ? lockScreen.idleTimeout : undefined}
          />
        )}
        {children}
      </OSProvider>
    </div>
  )
}
