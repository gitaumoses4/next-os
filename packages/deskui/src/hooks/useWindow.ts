'use client'

import { useCallback } from 'react'
import { useOSStore } from '@/store/windowStore'
import { useOSContext } from '@/context/OSContext'

export function useWindow(appId?: string) {
  const { apps } = useOSContext()
  const store = useOSStore()

  const openWindow = useCallback((id: string) => store.openWindow(id, apps), [store, apps])

  // Unscoped API
  if (!appId) {
    return {
      openWindow,
      closeWindow: store.closeWindow,
      focusWindow: store.focusWindow,
    }
  }

  // Scoped API
  const windowEntry = Object.values(store.windows).find((w) => w.appId === appId)

  return {
    open: () => openWindow(appId),
    close: () => windowEntry && store.closeWindow(windowEntry.id),
    minimize: () => windowEntry && store.minimizeWindow(windowEntry.id),
    maximize: () => windowEntry && store.maximizeWindow(windowEntry.id),
    restore: () => windowEntry && store.restoreWindow(windowEntry.id),
    isOpen: !!windowEntry,
    isFocused: windowEntry?.isFocused ?? false,
  }
}
