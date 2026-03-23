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

  const win = windows[windowId]
  const app = apps.find((a) => a.id === win?.appId)
  const minW = app?.minSize?.w ?? 200
  const minH = app?.minSize?.h ?? 150
  const maxW = app?.maxSize?.w ?? Infinity
  const maxH = app?.maxSize?.h ?? Infinity

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

      // East
      if (handle.includes('e')) {
        newW = Math.min(maxW, Math.max(minW, s.winW + dx))
      }
      // West
      if (handle.includes('w')) {
        const proposedW = Math.min(maxW, Math.max(minW, s.winW - dx))
        newX = s.winX + (s.winW - proposedW)
        newW = proposedW
      }
      // South
      if (handle === 's' || handle === 'se' || handle === 'sw') {
        newH = Math.min(maxH, Math.max(minH, s.winH + dy))
      }
      // North
      if (handle === 'n' || handle === 'ne' || handle === 'nw') {
        const proposedH = Math.min(maxH, Math.max(minH, s.winH - dy))
        newY = s.winY + (s.winH - proposedH)
        newH = proposedH
      }

      resizeWindow(windowId, { w: newW, h: newH })
      if (newX !== s.winX || newY !== s.winY) {
        moveWindow(windowId, { x: newX, y: newY })
      }
    },
    [windowId, handle, minW, minH, maxW, maxH, resizeWindow, moveWindow],
  )

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if ((e.target as HTMLElement).hasPointerCapture(e.pointerId)) {
      ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
    }
    startRef.current = null
  }, [])

  return {
    resizeProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      style: { touchAction: 'none' as const },
    },
  }
}
