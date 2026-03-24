'use client'

import { useEffect } from 'react'
import { useOSStore } from '@/store/windowStore'
import type { AppDefinition } from '@/types'

interface KeyboardShortcutsOptions {
  apps: AppDefinition[]
  barHeight: number
  barPosition: 'top' | 'bottom'
  onToggleCommandPalette?: () => void
}

export function useKeyboardShortcuts({
  apps,
  barHeight,
  barPosition,
  onToggleCommandPalette,
}: KeyboardShortcutsOptions) {
  const store = useOSStore()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey

      // Cmd/Ctrl+K: command palette
      if (mod && e.key === 'k') {
        e.preventDefault()
        onToggleCommandPalette?.()
        return
      }

      // Cmd/Ctrl+W: close focused window
      if (mod && e.key === 'w') {
        e.preventDefault()
        const focused = Object.values(store.windows).find((w) => w.isFocused)
        if (focused) store.closeWindow(focused.id)
        return
      }

      // Cmd/Ctrl+M: minimize focused window
      if (mod && e.key === 'm') {
        e.preventDefault()
        const focused = Object.values(store.windows).find((w) => w.isFocused)
        if (focused) store.minimizeWindow(focused.id)
        return
      }

      // Cmd/Ctrl+Shift+F: maximize/restore focused window
      if (mod && e.shiftKey && e.key === 'F') {
        e.preventDefault()
        const focused = Object.values(store.windows).find((w) => w.isFocused)
        if (!focused) return
        if (focused.status === 'maximized') {
          store.restoreWindow(focused.id)
        } else {
          store.maximizeWindow(focused.id, barHeight, barPosition)
        }
        return
      }

      // Cmd/Ctrl+Tab is handled by WindowSwitcher component

      // Cmd/Ctrl+`: cycle windows of same app
      if (mod && e.key === '`') {
        e.preventDefault()
        const focused = Object.values(store.windows).find((w) => w.isFocused)
        if (!focused) return

        const sameAppWindows = store.zStack.filter(
          (id) =>
            store.windows[id]?.appId === focused.appId && store.windows[id]?.status !== 'minimized',
        )
        if (sameAppWindows.length < 2) return

        const currentIdx = sameAppWindows.indexOf(focused.id)
        const nextIdx = (currentIdx + 1) % sameAppWindows.length
        store.focusWindow(sameAppWindows[nextIdx])
        return
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [store, apps, barHeight, barPosition, onToggleCommandPalette])
}
