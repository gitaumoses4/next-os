'use client'

import { useEffect } from 'react'
import { useOSStore } from '@/store/windowStore'

/**
 * Listens for postMessage events from iframe windows and routes them
 * to the correct store actions. Must be mounted inside the OSShell.
 */
export function useBridgeListener() {
  const store = useOSStore()

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      const data = e.data
      if (!data || !data.__deskui) return

      // Find which window's iframe sent this message
      const sourceWindow = Object.values(store.windows).find(() => {
        // Match by source — the iframe's contentWindow
        const iframes = document.querySelectorAll('iframe')
        for (const iframe of iframes) {
          if (iframe.contentWindow === e.source) {
            return true
          }
        }
        return false
      })

      // Find window ID by matching iframe source
      let windowId: string | null = null
      let appId: string | null = null
      const iframes = document.querySelectorAll('iframe')
      for (const iframe of iframes) {
        if (iframe.contentWindow === e.source) {
          // Walk up to find the window container and get its window ID
          // The iframe is inside WindowContent which is inside the window div
          const windowEl = iframe.closest('[data-window-id]')
          if (windowEl) {
            windowId = windowEl.getAttribute('data-window-id')
            if (windowId && store.windows[windowId]) {
              appId = store.windows[windowId].appId
            }
          }
          break
        }
      }

      if (!windowId) return

      switch (data.type) {
        case 'setTitle':
          if (data.title) store.setWindowTitle(windowId, data.title)
          break
        case 'close':
          store.closeWindow(windowId)
          break
        case 'minimize':
          store.minimizeWindow(windowId)
          break
        case 'maximize':
          store.maximizeWindow(windowId)
          break
        case 'focus':
          store.focusWindow(windowId)
          break
        case 'setBadge':
          if (appId && typeof data.count === 'number') {
            store.setBadge(appId, data.count)
          }
          break
      }
    }

    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [store])
}
