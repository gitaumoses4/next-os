'use client'

import { useCallback, useRef } from 'react'
import { useOSStore } from '@/store/windowStore'
import { useOSContext } from '@/context/OSContext'

type Handle = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw'

interface StartState {
  x: number
  y: number
  winX: number
  winY: number
  winW: number
  winH: number
}

export function useWindowResize(windowId: string, handle: Handle) {
  const moveWindow = useOSStore((s) => s.moveWindow)
  const resizeWindow = useOSStore((s) => s.resizeWindow)
  const windows = useOSStore((s) => s.windows)
  const { apps } = useOSContext()
  const startRef = useRef<StartState | null>(null)
  const rafRef = useRef<number | null>(null)
  const pendingRef = useRef<{ x: number; y: number; w: number; h: number } | null>(null)

  const win = windows[windowId]
  const app = apps.find((a) => a.id === win?.appId)
  const minW = app?.minSize?.w ?? 200
  const minH = app?.minSize?.h ?? 150
  const maxW = app?.maxSize?.w ?? Infinity
  const maxH = app?.maxSize?.h ?? Infinity

  const flush = useCallback(() => {
    const p = pendingRef.current
    if (p) {
      resizeWindow(windowId, { w: p.w, h: p.h })
      moveWindow(windowId, { x: p.x, y: p.y })
      pendingRef.current = null
    }
    rafRef.current = null
  }, [windowId, resizeWindow, moveWindow])

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const w = windows[windowId]
      if (!w) return

      e.preventDefault()
      e.stopPropagation()
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)

      startRef.current = {
        x: e.clientX,
        y: e.clientY,
        winX: w.position.x,
        winY: w.position.y,
        winW: w.size.w,
        winH: w.size.h,
      }
    },
    [windowId, windows],
  )

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!(e.target as HTMLElement).hasPointerCapture(e.pointerId)) return
      const s = startRef.current
      if (!s) return

      const dx = e.clientX - s.x
      const dy = e.clientY - s.y

      let newW = s.winW
      let newH = s.winH
      let newX = s.winX
      let newY = s.winY

      if (handle.includes('e')) {
        newW = Math.min(maxW, Math.max(minW, s.winW + dx))
      }
      if (handle.includes('w')) {
        const proposedW = Math.min(maxW, Math.max(minW, s.winW - dx))
        newX = s.winX + (s.winW - proposedW)
        newW = proposedW
      }
      if (handle === 's' || handle === 'se' || handle === 'sw') {
        newH = Math.min(maxH, Math.max(minH, s.winH + dy))
      }
      if (handle === 'n' || handle === 'ne' || handle === 'nw') {
        const proposedH = Math.min(maxH, Math.max(minH, s.winH - dy))
        newY = s.winY + (s.winH - proposedH)
        newH = proposedH
      }

      pendingRef.current = { x: newX, y: newY, w: newW, h: newH }
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(flush)
      }
    },
    [handle, minW, minH, maxW, maxH, flush],
  )

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if ((e.target as HTMLElement).hasPointerCapture(e.pointerId)) {
        ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
      }

      // Flush final position
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      if (pendingRef.current) {
        const p = pendingRef.current
        resizeWindow(windowId, { w: p.w, h: p.h })
        moveWindow(windowId, { x: p.x, y: p.y })
        pendingRef.current = null
      }
      startRef.current = null
    },
    [windowId, resizeWindow, moveWindow],
  )

  return {
    resizeProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      style: { touchAction: 'none' as const },
    },
  }
}
