'use client'

import { useEffect } from 'react'
import { useOSStore } from '@/store/windowStore'
import type { AppDefinition } from '@/types'

interface KeyboardShortcutsOptions {
  apps: AppDefinition[]
  reservedSpace?: { height: number; position: 'top' | 'bottom' }
  onToggleCommandPalette?: () => void
}

export function useKeyboardShortcuts({
  apps,
  reservedSpace,
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
          store.maximizeWindow(focused.id, reservedSpace)
        }
        return
      }

      // Cmd/Ctrl+Arrow: tile focused window (halves)
      // Cmd/Ctrl+Shift+Arrow: tile focused window (thirds)
      if (mod && (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp')) {
        e.preventDefault()
        const focused = Object.values(store.windows).find((w) => w.isFocused)
        if (!focused) return

        const barHeight = reservedSpace?.height ?? 0
        const barPosition = reservedSpace?.position ?? 'bottom'

        if (e.shiftKey) {
          // Thirds
          if (e.key === 'ArrowLeft')
            store.snapWindow(focused.id, 'left-third', barHeight, barPosition)
          if (e.key === 'ArrowRight')
            store.snapWindow(focused.id, 'right-third', barHeight, barPosition)
          if (e.key === 'ArrowUp')
            store.snapWindow(focused.id, 'center-third', barHeight, barPosition)
        } else {
          // Halves / maximize
          if (e.key === 'ArrowLeft') store.snapWindow(focused.id, 'left', barHeight, barPosition)
          if (e.key === 'ArrowRight') store.snapWindow(focused.id, 'right', barHeight, barPosition)
          if (e.key === 'ArrowUp') store.maximizeWindow(focused.id, reservedSpace)
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
  }, [store, apps, reservedSpace, onToggleCommandPalette])
}
