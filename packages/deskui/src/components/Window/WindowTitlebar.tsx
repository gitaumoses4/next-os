'use client'

import { useCallback, useState } from 'react'
import { useOSContext } from '@/context/OSContext'
import { useOSStore } from '@/store/windowStore'
import { useWindowDrag } from '@/hooks/useWindowDrag'
import { useReservedSpace } from '@/hooks/useReservedSpace'
import { WindowControls } from './WindowControls'
import { ContextMenu } from '@/components/ContextMenu'
import type { ContextMenuItem } from '@/components/ContextMenu'
import type { AppDefinition } from '@/types'

interface WindowTitlebarProps {
  windowId: string
  app: AppDefinition
}

export function WindowTitlebar({ windowId, app }: WindowTitlebarProps) {
  const { theme } = useOSContext()
  const { dragProps } = useWindowDrag(windowId)
  const win = useOSStore((s) => s.windows[windowId])
  const maximizeWindow = useOSStore((s) => s.maximizeWindow)
  const restoreWindow = useOSStore((s) => s.restoreWindow)
  const minimizeWindow = useOSStore((s) => s.minimizeWindow)
  const requestClose = useOSStore((s) => s.requestClose)
  const moveWindow = useOSStore((s) => s.moveWindow)
  const togglePip = useOSStore((s) => s.togglePip)
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number } | null>(null)

  const { titlebarHeight, titlebarBg, titlebarBgUnfocused, titlebarTextColor, controlsPosition } =
    theme.windowChrome

  const isFocused = win?.isFocused ?? false
  const isMaximized = win?.status === 'maximized'
  const reservedSpace = useReservedSpace()

  const onClose = useCallback(() => requestClose(windowId), [requestClose, windowId])
  const onMinimize = useCallback(() => minimizeWindow(windowId), [minimizeWindow, windowId])
  const onMaximize = useCallback(
    () => maximizeWindow(windowId, reservedSpace),
    [maximizeWindow, windowId, reservedSpace],
  )
  const onRestore = useCallback(() => restoreWindow(windowId), [restoreWindow, windowId])

  const onDoubleClick = useCallback(() => {
    if (isMaximized) onRestore()
    else onMaximize()
  }, [isMaximized, onMaximize, onRestore])

  const onContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setContextMenuPos({ x: e.clientX, y: e.clientY })
  }, [])

  const titlebarMenuItems: ContextMenuItem[] = [
    {
      label: isMaximized ? 'Restore' : 'Maximize',
      shortcut: '⌘⇧F',
      action: () => (isMaximized ? onRestore() : onMaximize()),
    },
    { label: 'Minimize', shortcut: '⌘M', action: onMinimize },
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
    {
      label: win?.isPip ? 'Exit Picture in Picture' : 'Picture in Picture',
      action: () => togglePip(windowId),
    },
    { separator: true, label: '' },
    { label: 'Close', shortcut: '⌘W', danger: true, action: onClose },
  ]

  // Custom titlebar render prop
  if (app.renderTitlebar) {
    return (
      <>
        {app.renderTitlebar({
          windowId,
          title: win?.title ?? '',
          isFocused,
          isMaximized,
          onClose,
          onMinimize,
          onMaximize,
          onRestore,
          dragProps,
        })}
      </>
    )
  }

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
      <WindowControls windowId={windowId} app={app} />
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
