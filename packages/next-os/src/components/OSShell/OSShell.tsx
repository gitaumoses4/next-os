'use client'

import { useMemo, useState, useEffect } from 'react'
import type { AppDefinition, DeepPartial } from '@/types'
import type { OSTheme } from '@/themes/types'
import { macosTheme } from '@/themes/macos'
import { mergeTheme } from '@/utils/mergeTheme'
import { themeToVars } from '@/utils/themeVars'
import { OSProvider } from '@/context/OSProvider'
import { WindowManager } from '@/components/WindowManager'
import { Desktop } from '@/components/Desktop'
import { Dock } from '@/components/Dock'
import { Taskbar } from '@/components/Taskbar'
import '@/styles.css'

const builtInThemes: Record<string, OSTheme> = {
  macos: macosTheme,
}

export interface OSShellProps {
  apps: AppDefinition[]
  theme?: 'macos' | 'windows11' | 'ubuntu' | OSTheme | DeepPartial<OSTheme>
  wallpaper?: string
  taskbarVariant?: 'dock' | 'taskbar'
  initialWindows?: string[]
  onWindowOpen?: (appId: string) => void
  onWindowClose?: (windowId: string) => void
  onWindowFocus?: (windowId: string) => void
  children: React.ReactNode
}

function resolveTheme(theme: OSShellProps['theme']): OSTheme {
  if (!theme) return macosTheme

  // String name → built-in theme
  if (typeof theme === 'string') {
    return builtInThemes[theme] ?? macosTheme
  }

  // Full theme object (has `name` field)
  if ('name' in theme && theme.name && typeof theme.name === 'string') {
    // Check if it's a complete theme by looking for required sections
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

  // Partial theme → merge with macOS defaults
  return mergeTheme(macosTheme, theme as DeepPartial<OSTheme>)
}

export function OSShell({
  apps,
  theme: themeProp,
  wallpaper,
  taskbarVariant = 'dock',
  initialWindows,
  onWindowOpen,
  onWindowClose,
  onWindowFocus,
  children,
}: OSShellProps) {
  const [isIframe, setIsIframe] = useState(false)

  useEffect(() => {
    setIsIframe(window.self !== window.top)
  }, [])

  const theme = useMemo(() => resolveTheme(themeProp), [themeProp])
  const cssVars = useMemo(() => themeToVars(theme), [theme])

  // Inside an iframe (window content) — render children only, no shell
  if (isIframe) {
    return <>{children}</>
  }

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
        {children}
      </OSProvider>
    </div>
  )
}
