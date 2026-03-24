'use client'

import { useEffect, useRef } from 'react'
import { useOSStore } from '@/store/windowStore'
import type { AppDefinition } from '@/types'

interface UrlSyncOptions {
  apps: AppDefinition[]
  enabled: boolean | 'read' | 'read-write'
}

/**
 * Syncs window state with the URL pathname.
 *
 * On mount:
 * - Reads the URL pathname and opens + focuses the matching app
 *
 * On change (if 'read-write'):
 * - Updates the pathname to the focused app's route
 */
export function useUrlSync({ apps, enabled }: UrlSyncOptions) {
  const openWindow = useOSStore((s) => s.openWindow)
  const windows = useOSStore((s) => s.windows)
  const initialized = useRef(false)

  // Read URL on mount and open matching app
  useEffect(() => {
    if (!enabled || initialized.current) return
    initialized.current = true

    const pathname = window.location.pathname

    if (pathname && pathname !== '/') {
      const matchingApp = apps.find((app) => {
        return pathname === app.route || pathname.startsWith(app.route + '/')
      })
      if (matchingApp) {
        openWindow(matchingApp.id, apps)
      }
    }
  }, [enabled, apps, openWindow])

  // Write URL on window changes (if read-write mode)
  // Updates pathname to the focused app's route, or / if no windows are open
  useEffect(() => {
    if (enabled !== 'read-write') return

    const focusedWindow = Object.values(windows).find((w) => w.isFocused)
    const focusedApp = focusedWindow ? apps.find((a) => a.id === focusedWindow.appId) : null

    const newPath = focusedApp?.route ?? '/'

    if (newPath !== window.location.pathname) {
      window.history.replaceState({}, '', newPath)
    }
  }, [enabled, windows, apps])
}
