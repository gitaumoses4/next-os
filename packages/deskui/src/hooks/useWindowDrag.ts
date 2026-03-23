'use client'

import { useCallback, useRef } from 'react'
import { useOSStore } from '@/store/windowStore'

const TITLEBAR_MIN_VISIBLE = 40

export function useWindowDrag(windowId: string) {
  const moveWindow = useOSStore((s) => s.moveWindow)
  const focusWindow = useOSStore((s) => s.focusWindow)
  const restoreWindow = useOSStore((s) => s.restoreWindow)
  const setDragging = useOSStore((s) => s.setDragging)
  const windows = useOSStore((s) => s.windows)
  const offsetRef = useRef({ x: 0, y: 0 })
  const wasDraggingMaximized = useRef(false)
  const rafRef = useRef<number | null>(null)
  const pendingPos = useRef<{ x: number; y: number } | null>(null)

  const flushPosition = useCallback(() => {
    if (pendingPos.current) {
      moveWindow(windowId, pendingPos.current)
      pendingPos.current = null
    }
    rafRef.current = null
  }, [windowId, moveWindow])

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const win = windows[windowId]
      if (!win) return

      e.preventDefault()
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      focusWindow(windowId)
      setDragging(windowId)

      if (win.status === 'maximized') {
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
    [windowId, windows, focusWindow, setDragging],
  )

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!(e.target as HTMLElement).hasPointerCapture(e.pointerId)) return

      if (wasDraggingMaximized.current) {
        wasDraggingMaximized.current = false
        restoreWindow(windowId)
      }

      const win = windows[windowId]
      if (!win || win.status === 'maximized') return

      const x = Math.max(
        -(win.size.w - TITLEBAR_MIN_VISIBLE),
        Math.min(e.clientX - offsetRef.current.x, window.innerWidth - TITLEBAR_MIN_VISIBLE),
      )
      const y = Math.max(
        0,
        Math.min(e.clientY - offsetRef.current.y, window.innerHeight - TITLEBAR_MIN_VISIBLE),
      )

      // Batch position updates with rAF
      pendingPos.current = { x, y }
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(flushPosition)
      }
    },
    [windowId, windows, restoreWindow, flushPosition],
  )

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      wasDraggingMaximized.current = false
      setDragging(null)

      // Flush any pending position
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      if (pendingPos.current) {
        moveWindow(windowId, pendingPos.current)
        pendingPos.current = null
      }

      if ((e.target as HTMLElement).hasPointerCapture(e.pointerId)) {
        ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
      }
    },
    [windowId, moveWindow, setDragging],
  )

  return {
    dragProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      style: { touchAction: 'none' as const, userSelect: 'none' as const },
    },
  }
}
