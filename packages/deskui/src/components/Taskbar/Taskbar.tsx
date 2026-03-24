'use client'

import { useOSContext } from '@/context/OSContext'
import { useOSStore } from '@/store/windowStore'
import { useNotificationStore } from '@/store/notificationStore'
import { TaskbarItem } from './TaskbarItem'
import { TaskbarClock } from './TaskbarClock'

export function Taskbar() {
  const { theme } = useOSContext()
  const windows = useOSStore((s) => s.windows)
  const showDesktop = useOSStore((s) => s.showDesktop)
  const togglePanel = useNotificationStore((s) => s.togglePanel)
  const unreadCount = useNotificationStore((s) => s.notifications.filter((n) => !n.read).length)
  const { height, bg, blur, textColor, position, itemActiveBg } = theme.taskbar

  const openWindows = Object.values(windows)

  return (
    <div
      role="toolbar"
      aria-label="Taskbar"
      style={{
        position: 'absolute',
        [position]: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        height,
        padding: '0 8px',
        background: bg,
        backdropFilter: blur,
        WebkitBackdropFilter: blur,
        color: textColor,
        gap: 4,
      }}
    >
      {/* Start button */}
      <button
        style={{
          width: 36,
          height: 36,
          borderRadius: 4,
          border: 'none',
          background: 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16,
          flexShrink: 0,
          cursor: 'pointer',
          color: 'inherit',
        }}
        aria-label="Start"
      >
        ⊞
      </button>

      {/* Open windows */}
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

      {/* System tray */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          flexShrink: 0,
        }}
      >
        {/* Notification bell */}
        <button
          onClick={togglePanel}
          style={{
            position: 'relative',
            background: 'transparent',
            border: 'none',
            color: 'inherit',
            fontSize: 14,
            cursor: 'pointer',
            padding: '4px 6px',
            borderRadius: 4,
          }}
          aria-label="Notifications"
        >
          🔔
          {unreadCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: 2,
                right: 2,
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: theme.dock.badgeBg,
              }}
            />
          )}
        </button>

        <TaskbarClock />

        {/* Show desktop button */}
        <button
          onClick={showDesktop}
          style={{
            width: 4,
            height: height - 8,
            background: textColor,
            opacity: 0.3,
            border: 'none',
            borderRadius: 1,
            cursor: 'pointer',
            flexShrink: 0,
          }}
          aria-label="Show desktop"
        />
      </div>
    </div>
  )
}
