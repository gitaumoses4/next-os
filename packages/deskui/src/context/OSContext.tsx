'use client'

import { createContext, useContext } from 'react'
import type { AppDefinition } from '@/types'
import type { OSTheme } from '@/themes/types'

export interface OSContextValue {
  apps: AppDefinition[]
  theme: OSTheme
  taskbarVariant: 'dock' | 'taskbar'
  wallpaper?: string | string[] | (() => string)
  onWindowOpen?: (appId: string) => void
  onWindowClose?: (windowId: string) => void
  onWindowFocus?: (windowId: string) => void
}

export const OSContext = createContext<OSContextValue | null>(null)

export function useOSContext(): OSContextValue {
  const ctx = useContext(OSContext)
  if (!ctx) {
    throw new Error('useOSContext must be used within an OSShell')
  }
  return ctx
}
