'use client'

import { useEffect, useRef } from 'react'
import { useOSStore } from '@/store/windowStore'

const STORAGE_KEY = 'deskui-layout'

interface PersistedWindow {
  appId: string
  position: { x: number; y: number }
  size: { w: number; h: number }
}

/**
 * Persists window positions and sizes to localStorage.
 * On mount, restores saved layout by adjusting window positions.
 */
export function usePersistedLayout(enabled: boolean) {
  const windows = useOSStore((s) => s.windows)
  const moveWindow = useOSStore((s) => s.moveWindow)
  const resizeWindow = useOSStore((s) => s.resizeWindow)
  const initialized = useRef(false)

  // Restore saved positions on mount
  useEffect(() => {
    if (!enabled || initialized.current) return
    initialized.current = true

    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (!saved) return

      const layout: PersistedWindow[] = JSON.parse(saved)
      const currentWindows = useOSStore.getState().windows

      for (const win of Object.values(currentWindows)) {
        const savedWin = layout.find((s) => s.appId === win.appId)
        if (savedWin) {
          moveWindow(win.id, savedWin.position)
          resizeWindow(win.id, savedWin.size)
        }
      }
    } catch {
      // Ignore corrupt data
    }
  }, [enabled, moveWindow, resizeWindow])

  // Save layout on changes (debounced)
  useEffect(() => {
    if (!enabled) return

    const timer = setTimeout(() => {
      const layout: PersistedWindow[] = Object.values(windows)
        .filter((w) => w.status !== 'minimized')
        .map((w) => ({
          appId: w.appId,
          position: w.position,
          size: w.size,
        }))

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(layout))
      } catch {
        // Storage full or unavailable
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [enabled, windows])
}
