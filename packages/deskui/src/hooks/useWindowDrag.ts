'use client'

import { useCallback, useRef } from 'react'
import { useOSStore } from '@/store/windowStore'

const TITLEBAR_MIN_VISIBLE = 40

export function useWindowDrag(windowId: string) {
  const moveWindow = useOSStore((s) => s.moveWindow)
  const focusWindow = useOSStore((s) => s.focusWindow)
  const restoreWindow = useOSStore((s) => s.restoreWindow)
  const windows = useOSStore((s) => s.windows)
  const offsetRef = useRef({ x: 0, y: 0 })
  const wasDraggingMaximized = useRef(false)

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const win = windows[windowId]
      if (!win) return

      e.preventDefault()
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      focusWindow(windowId)

      if (win.status === 'maximized') {
        // Drag-to-unmaximize: remember grab ratio for repositioning after restore
        wasDraggingMaximized.current = true
        const grabRatioX = e.clientX / window.innerWidth
        const preW = win.preMaximizeSize?.w ?? win.size.w * 0.6
        offsetRef.current = {
          x: grabRatioX * preW,
          y: e.clientY,
        }
      } else {
        wasDraggingMaximized.current = false
        offsetRef.current = {
          x: e.clientX - win.position.x,
          y: e.clientY - win.position.y,
        }
      }
    },
    [windowId, windows, focusWindow],
  )

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!(e.target as HTMLElement).hasPointerCapture(e.pointerId)) return

      // Drag-to-unmaximize: restore on first move
      if (wasDraggingMaximized.current) {
        wasDraggingMaximized.current = false
        restoreWindow(windowId)
      }

      const win = windows[windowId]
      if (!win || win.status === 'maximized') return

      // Clamp so titlebar stays visible from all edges
      const x = Math.max(
        -(win.size.w - TITLEBAR_MIN_VISIBLE),
        Math.min(e.clientX - offsetRef.current.x, window.innerWidth - TITLEBAR_MIN_VISIBLE),
      )
      const y = Math.max(
        0,
        Math.min(e.clientY - offsetRef.current.y, window.innerHeight - TITLEBAR_MIN_VISIBLE),
      )

      moveWindow(windowId, { x, y })
    },
    [windowId, windows, moveWindow, restoreWindow],
  )

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    wasDraggingMaximized.current = false
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
