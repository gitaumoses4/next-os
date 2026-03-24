'use client'

import { useCallback } from 'react'
import { useWindowResize } from '@/hooks/useWindowResize'
import { useOSStore } from '@/store/windowStore'

type Handle = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw'

const HANDLE_SIZE = 6

const handlePositions: Record<Handle, React.CSSProperties> = {
  n: { top: 0, left: HANDLE_SIZE, right: HANDLE_SIZE, height: HANDLE_SIZE, cursor: 'n-resize' },
  ne: { top: 0, right: 0, width: HANDLE_SIZE, height: HANDLE_SIZE, cursor: 'ne-resize' },
  e: { top: HANDLE_SIZE, right: 0, bottom: HANDLE_SIZE, width: HANDLE_SIZE, cursor: 'e-resize' },
  se: { bottom: 0, right: 0, width: HANDLE_SIZE, height: HANDLE_SIZE, cursor: 'se-resize' },
  s: {
    bottom: 0,
    left: HANDLE_SIZE,
    right: HANDLE_SIZE,
    height: HANDLE_SIZE,
    cursor: 's-resize',
  },
  sw: { bottom: 0, left: 0, width: HANDLE_SIZE, height: HANDLE_SIZE, cursor: 'sw-resize' },
  w: { top: HANDLE_SIZE, left: 0, bottom: HANDLE_SIZE, width: HANDLE_SIZE, cursor: 'w-resize' },
  nw: { top: 0, left: 0, width: HANDLE_SIZE, height: HANDLE_SIZE, cursor: 'nw-resize' },
}

const handles: Handle[] = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw']

interface WindowResizeHandlesProps {
  windowId: string
}

export function WindowResizeHandles({ windowId }: WindowResizeHandlesProps) {
  return (
    <>
      {handles.map((handle) => (
        <ResizeHandle key={handle} windowId={windowId} handle={handle} />
      ))}
    </>
  )
}

function ResizeHandle({ windowId, handle }: { windowId: string; handle: Handle }) {
  const { resizeProps } = useWindowResize(windowId, handle)
  const moveWindow = useOSStore((s) => s.moveWindow)
  const resizeWindow = useOSStore((s) => s.resizeWindow)
  const windows = useOSStore((s) => s.windows)

  // Double-click to expand to screen boundary in that direction
  const onDoubleClick = useCallback(() => {
    const win = windows[windowId]
    if (!win) return

    const vw = window.innerWidth
    const vh = window.innerHeight

    let { x, y } = win.position
    let { w, h } = win.size

    if (handle.includes('e')) w = vw - x
    if (handle.includes('w')) {
      w = x + w
      x = 0
    }
    if (handle === 's' || handle === 'se' || handle === 'sw') h = vh - y
    if (handle === 'n' || handle === 'ne' || handle === 'nw') {
      h = y + h
      y = 0
    }

    resizeWindow(windowId, { w, h })
    moveWindow(windowId, { x, y })
  }, [windowId, handle, windows, resizeWindow, moveWindow])

  return (
    <div
      {...resizeProps}
      onDoubleClick={onDoubleClick}
      style={{
        ...resizeProps.style,
        position: 'absolute',
        ...handlePositions[handle],
        zIndex: 1,
      }}
    />
  )
}
