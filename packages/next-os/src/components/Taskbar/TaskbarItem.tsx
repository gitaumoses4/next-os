'use client'

import { useCallback } from 'react'
import { useOSStore } from '@/store/windowStore'
import { useOSContext } from '@/context/OSContext'
import { AppIcon } from '@/components/shared/AppIcon'
import type { WindowState } from '@/store/windowStore'

interface TaskbarItemProps {
  windowState: WindowState
}

export function TaskbarItem({ windowState }: TaskbarItemProps) {
  const { theme, apps } = useOSContext()
  const focusWindow = useOSStore((s) => s.focusWindow)
  const minimizeWindow = useOSStore((s) => s.minimizeWindow)

  const app = apps.find((a) => a.id === windowState.appId)
  const { itemActiveBg, textColor } = theme.taskbar

  const onClick = useCallback(() => {
    if (windowState.isFocused) {
      minimizeWindow(windowState.id)
    } else {
      focusWindow(windowState.id)
    }
  }, [windowState.id, windowState.isFocused, focusWindow, minimizeWindow])

  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 12px',
        border: 'none',
        borderRadius: 4,
        cursor: 'pointer',
        background: windowState.isFocused ? itemActiveBg : 'transparent',
        color: textColor,
        fontSize: 12,
        maxWidth: 180,
        overflow: 'hidden',
      }}
    >
      {app && <AppIcon icon={app.icon} size={16} />}
      <span
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {windowState.title}
      </span>
    </button>
  )
}
