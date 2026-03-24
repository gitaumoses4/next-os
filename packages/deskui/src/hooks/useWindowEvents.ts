'use client'

import { useEffect, useRef } from 'react'
import { useOSStore } from '@/store/windowStore'

interface WindowEventHandlers {
  onFocus?: (windowId: string) => void
  onBlur?: (windowId: string) => void
  onMove?: (windowId: string, position: { x: number; y: number }) => void
  onResize?: (windowId: string, size: { w: number; h: number }) => void
  onMaximize?: (windowId: string) => void
  onMinimize?: (windowId: string) => void
  onRestore?: (windowId: string) => void
  onClose?: (windowId: string) => void
  onOpen?: (windowId: string, appId: string) => void
}

/**
 * Hook for listening to window lifecycle events.
 * Compares previous and current state on each store change
 * and fires the appropriate callbacks.
 */
export function useWindowEvents(handlers: WindowEventHandlers) {
  const windows = useOSStore((s) => s.windows)
  const prevRef = useRef(windows)

  useEffect(() => {
    const prev = prevRef.current
    const curr = windows

    // Detect new windows (opened)
    for (const [id, win] of Object.entries(curr)) {
      if (!prev[id]) {
        handlers.onOpen?.(id, win.appId)
      }
    }

    // Detect removed windows (closed)
    for (const id of Object.keys(prev)) {
      if (!curr[id]) {
        handlers.onClose?.(id)
      }
    }

    // Detect state changes
    for (const [id, win] of Object.entries(curr)) {
      const prevWin = prev[id]
      if (!prevWin) continue

      // Focus/blur
      if (win.isFocused && !prevWin.isFocused) handlers.onFocus?.(id)
      if (!win.isFocused && prevWin.isFocused) handlers.onBlur?.(id)

      // Position
      if (win.position.x !== prevWin.position.x || win.position.y !== prevWin.position.y) {
        handlers.onMove?.(id, win.position)
      }

      // Size
      if (win.size.w !== prevWin.size.w || win.size.h !== prevWin.size.h) {
        handlers.onResize?.(id, win.size)
      }

      // Status changes
      if (win.status !== prevWin.status) {
        if (win.status === 'maximized') handlers.onMaximize?.(id)
        if (win.status === 'minimized') handlers.onMinimize?.(id)
        if (win.status === 'open' && prevWin.status !== 'open') handlers.onRestore?.(id)
      }
    }

    prevRef.current = curr
  }, [windows, handlers])
}
