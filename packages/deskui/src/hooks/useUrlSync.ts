'use client'

import { useEffect, useRef } from 'react'
import { useOSStore } from '@/store/windowStore'
import type { AppDefinition } from '@/types'

interface UrlSyncOptions {
  apps: AppDefinition[]
  enabled: boolean | 'read' | 'read-write'
}

/**
 * Syncs window state with the URL.
 *
 * On mount:
 * - Reads the URL pathname and opens matching app (e.g., /dashboard opens the dashboard app)
 * - Reads ?apps=id1,id2 query param and opens those apps
 * - Reads ?focus=id query param to focus a specific app
 *
 * On change (if 'read-write'):
 * - Updates the URL query params when windows open/close/focus
 */
export function useUrlSync({ apps, enabled }: UrlSyncOptions) {
  const openWindow = useOSStore((s) => s.openWindow)
  const focusWindow = useOSStore((s) => s.focusWindow)
  const windows = useOSStore((s) => s.windows)
  const initialized = useRef(false)

  // Read URL on mount and open matching windows
  useEffect(() => {
    if (!enabled || initialized.current) return
    initialized.current = true

    const url = new URL(window.location.href)
    const pathname = url.pathname

    // 1. Check ?apps=dashboard,notes query param
    const appsParam = url.searchParams.get('apps')
    if (appsParam) {
      const appIds = appsParam.split(',').map((s) => s.trim())
      for (const appId of appIds) {
        openWindow(appId, apps)
      }
      // Focus the last one
      const focusParam = url.searchParams.get('focus')
      if (focusParam) {
        const focusApp = Object.values(useOSStore.getState().windows).find(
          (w) => w.appId === focusParam,
        )
        if (focusApp) focusWindow(focusApp.id)
      }
      return
    }

    // 2. Match pathname to app route (e.g., /dashboard matches app with route: '/dashboard')
    if (pathname && pathname !== '/') {
      const matchingApp = apps.find((app) => {
        // Exact match or starts-with for nested routes
        return pathname === app.route || pathname.startsWith(app.route + '/')
      })
      if (matchingApp) {
        openWindow(matchingApp.id, apps)
      }
    }
  }, [enabled, apps, openWindow, focusWindow])

  // Write URL on window changes (if read-write mode)
  useEffect(() => {
    if (enabled !== 'read-write') return

    const openAppIds = [...new Set(Object.values(windows).map((w) => w.appId))]
    const focusedApp = Object.values(windows).find((w) => w.isFocused)

    const url = new URL(window.location.href)

    if (openAppIds.length > 0) {
      url.searchParams.set('apps', openAppIds.join(','))
    } else {
      url.searchParams.delete('apps')
    }

    if (focusedApp) {
      url.searchParams.set('focus', focusedApp.appId)
    } else {
      url.searchParams.delete('focus')
    }

    // Only update if changed
    if (url.toString() !== window.location.href) {
      window.history.replaceState({}, '', url.toString())
    }
  }, [enabled, windows])
}
