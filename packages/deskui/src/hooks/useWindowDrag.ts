'use client'

import { useCallback, useRef } from 'react'
import { useOSStore } from '@/store/windowStore'

export function useWindowDrag(windowId: string) {
  const moveWindow = useOSStore((s) => s.moveWindow)
  const focusWindow = useOSStore((s) => s.focusWindow)
  const windows = useOSStore((s) => s.windows)
  const offsetRef = useRef({ x: 0, y: 0 })

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const win = windows[windowId]
      if (!win || win.status === 'maximized') return

      e.preventDefault()
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      focusWindow(windowId)

      offsetRef.current = {
        x: e.clientX - win.position.x,
        y: e.clientY - win.position.y,
      }
    },
    [windowId, windows, focusWindow],
  )

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!(e.target as HTMLElement).hasPointerCapture(e.pointerId)) return

      const x = Math.max(0, Math.min(e.clientX - offsetRef.current.x, window.innerWidth - 100))
      const y = Math.max(0, Math.min(e.clientY - offsetRef.current.y, window.innerHeight - 50))

      moveWindow(windowId, { x, y })
    },
    [windowId, moveWindow],
  )

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if ((e.target as HTMLElement).hasPointerCapture(e.pointerId)) {
      ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
    }
  }, [])

  return {
    dragProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      style: { touchAction: 'none' as const, userSelect: 'none' as const },
    },
  }
}
