'use client'

import { useCallback } from 'react'
import { useOSContext } from '@/context/OSContext'
import { useOSStore } from '@/store/windowStore'
import { useWindowDrag } from '@/hooks/useWindowDrag'
import { WindowControls } from './WindowControls'

interface WindowTitlebarProps {
  windowId: string
}

export function WindowTitlebar({ windowId }: WindowTitlebarProps) {
  const { theme } = useOSContext()
  const { dragProps } = useWindowDrag(windowId)
  const win = useOSStore((s) => s.windows[windowId])
  const maximizeWindow = useOSStore((s) => s.maximizeWindow)
  const restoreWindow = useOSStore((s) => s.restoreWindow)

  const { titlebarHeight, titlebarBg, titlebarBgUnfocused, titlebarTextColor, controlsPosition } =
    theme.windowChrome

  const isFocused = win?.isFocused ?? false

  const onDoubleClick = useCallback(() => {
    if (win?.status === 'maximized') {
      restoreWindow(windowId)
    } else {
      maximizeWindow(windowId)
    }
  }, [win?.status, windowId, maximizeWindow, restoreWindow])

  return (
    <div
      {...dragProps}
      onDoubleClick={onDoubleClick}
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
        cursor: win?.status === 'maximized' ? 'default' : 'grab',
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
      {/* Spacer to balance controls when left-positioned */}
      {controlsPosition === 'left' && <div style={{ width: 60 }} />}
    </div>
  )
}
