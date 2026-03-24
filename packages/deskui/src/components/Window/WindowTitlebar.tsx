'use client'

import { useCallback, useState } from 'react'
import { useOSContext } from '@/context/OSContext'
import { useOSStore } from '@/store/windowStore'
import { useWindowDrag } from '@/hooks/useWindowDrag'
import { WindowControls } from './WindowControls'
import { ContextMenu } from '@/components/ContextMenu'
import type { ContextMenuItem } from '@/components/ContextMenu'

interface WindowTitlebarProps {
  windowId: string
}

export function WindowTitlebar({ windowId }: WindowTitlebarProps) {
  const { theme, taskbarVariant } = useOSContext()
  const { dragProps } = useWindowDrag(windowId)
  const win = useOSStore((s) => s.windows[windowId])
  const maximizeWindow = useOSStore((s) => s.maximizeWindow)
  const restoreWindow = useOSStore((s) => s.restoreWindow)
  const minimizeWindow = useOSStore((s) => s.minimizeWindow)
  const closeWindow = useOSStore((s) => s.closeWindow)
  const moveWindow = useOSStore((s) => s.moveWindow)
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number } | null>(null)

  const { titlebarHeight, titlebarBg, titlebarBgUnfocused, titlebarTextColor, controlsPosition } =
    theme.windowChrome

  const isFocused = win?.isFocused ?? false
  const isMaximized = win?.status === 'maximized'
  const barHeight = taskbarVariant === 'dock' ? theme.dock.height : theme.taskbar.height
  const barPosition = taskbarVariant === 'dock' ? theme.dock.position : theme.taskbar.position

  const onDoubleClick = useCallback(() => {
    if (isMaximized) {
      restoreWindow(windowId)
    } else {
      maximizeWindow(windowId, barHeight, barPosition)
    }
  }, [isMaximized, windowId, maximizeWindow, restoreWindow, barHeight, barPosition])

  const onContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setContextMenuPos({ x: e.clientX, y: e.clientY })
  }, [])

  const titlebarMenuItems: ContextMenuItem[] = [
    {
      label: isMaximized ? 'Restore' : 'Maximize',
      shortcut: '⌘⇧F',
      action: () =>
        isMaximized ? restoreWindow(windowId) : maximizeWindow(windowId, barHeight, barPosition),
    },
    {
      label: 'Minimize',
      shortcut: '⌘M',
      action: () => minimizeWindow(windowId),
    },
    {
      label: 'Move to Center',
      action: () => {
        if (win) {
          moveWindow(windowId, {
            x: Math.round((window.innerWidth - win.size.w) / 2),
            y: Math.round((window.innerHeight - win.size.h) / 2),
          })
        }
      },
    },
    { separator: true, label: '' },
    {
      label: 'Close',
      shortcut: '⌘W',
      danger: true,
      action: () => closeWindow(windowId),
    },
  ]

  return (
    <div
      {...dragProps}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
      style={{
        ...dragProps.style,
        height: titlebarHeight,
        background: isFocused ? titlebarBg : titlebarBgUnfocused,
        color: titlebarTextColor,
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        gap: 8,
        borderTopLeftRadius: 'inherit',
        borderTopRightRadius: 'inherit',
        cursor: isMaximized ? 'default' : 'grab',
        flexShrink: 0,
      }}
    >
      <WindowControls windowId={windowId} />
      <span
        style={{
          flex: 1,
          textAlign: controlsPosition === 'left' ? 'center' : 'left',
          fontSize: 13,
          fontWeight: 500,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
        }}
      >
        {win?.title}
      </span>
      {controlsPosition === 'left' && <div style={{ width: 60 }} />}

      <ContextMenu
        items={titlebarMenuItems}
        position={contextMenuPos}
        onClose={() => setContextMenuPos(null)}
        theme={theme.contextMenu}
      />
    </div>
  )
}
