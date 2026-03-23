'use client'

import { useOSContext } from '@/context/OSContext'
import { useOSStore } from '@/store/windowStore'
import { TaskbarItem } from './TaskbarItem'
import { TaskbarClock } from './TaskbarClock'

export function Taskbar() {
  const { theme } = useOSContext()
  const windows = useOSStore((s) => s.windows)
  const { height, bg, blur, textColor, position } = theme.taskbar

  const openWindows = Object.values(windows).filter((w) => w.status !== 'minimized' || true)

  return (
    <div
      style={{
        position: 'absolute',
        [position]: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        height,
        padding: '0 12px',
        background: bg,
        backdropFilter: blur,
        WebkitBackdropFilter: blur,
        color: textColor,
        gap: 4,
      }}
    >
      {/* Left: logo placeholder */}
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16,
          flexShrink: 0,
        }}
      >
        ⊞
      </div>

      {/* Center: open windows */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          overflow: 'hidden',
        }}
      >
        {openWindows.map((win) => (
          <TaskbarItem key={win.id} windowState={win} />
        ))}
      </div>

      {/* Right: clock */}
      <TaskbarClock />
    </div>
  )
}
