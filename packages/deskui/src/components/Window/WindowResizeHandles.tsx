'use client'

import { useWindowResize } from '@/hooks/useWindowResize'

type Handle = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw'

const HANDLE_SIZE = 6

const handlePositions: Record<Handle, React.CSSProperties> = {
  n: { top: 0, left: HANDLE_SIZE, right: HANDLE_SIZE, height: HANDLE_SIZE, cursor: 'n-resize' },
  ne: { top: 0, right: 0, width: HANDLE_SIZE, height: HANDLE_SIZE, cursor: 'ne-resize' },
  e: { top: HANDLE_SIZE, right: 0, bottom: HANDLE_SIZE, width: HANDLE_SIZE, cursor: 'e-resize' },
  se: { bottom: 0, right: 0, width: HANDLE_SIZE, height: HANDLE_SIZE, cursor: 'se-resize' },
  s: { bottom: 0, left: HANDLE_SIZE, right: HANDLE_SIZE, height: HANDLE_SIZE, cursor: 's-resize' },
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

  return (
    <div
      {...resizeProps}
      style={{
        ...resizeProps.style,
        position: 'absolute',
        ...handlePositions[handle],
        zIndex: 1,
      }}
    />
  )
}
