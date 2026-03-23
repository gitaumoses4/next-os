'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useOSStore } from '@/store/windowStore'
import { useOSContext } from '@/context/OSContext'
import { AppIcon } from '@/components/shared/AppIcon'
import type { AppDefinition } from '@/types'

interface DockItemProps {
  app: AppDefinition
}

export function DockItem({ app }: DockItemProps) {
  const { theme, apps } = useOSContext()
  const windows = useOSStore((s) => s.windows)
  const openWindow = useOSStore((s) => s.openWindow)
  const focusWindow = useOSStore((s) => s.focusWindow)
  const minimizeWindow = useOSStore((s) => s.minimizeWindow)
  const restoreWindow = useOSStore((s) => s.restoreWindow)
  const bounceControls = useAnimation()
  const prevWindowCountRef = useRef(0)
  const [hovered, setHovered] = useState(false)

  const appWindows = Object.values(windows).filter((w) => w.appId === app.id)
  const hasWindow = appWindows.length > 0
  const focusedWindow = appWindows.find((w) => w.isFocused)
  const minimizedWindow = appWindows.find((w) => w.status === 'minimized')

  useEffect(() => {
    if (appWindows.length > prevWindowCountRef.current && appWindows.length > 0) {
      bounceControls.start({
        y: [0, -20, 0, -12, 0, -6, 0],
        transition: { duration: 0.4, ease: 'easeInOut' },
      })
    }
    prevWindowCountRef.current = appWindows.length
  }, [appWindows.length, bounceControls])

  const onClick = useCallback(() => {
    if (!hasWindow) {
      openWindow(app.id, apps)
    } else if (minimizedWindow) {
      restoreWindow(minimizedWindow.id)
    } else if (focusedWindow) {
      minimizeWindow(focusedWindow.id)
    } else {
      focusWindow(appWindows[0].id)
    }
  }, [
    hasWindow,
    minimizedWindow,
    focusedWindow,
    appWindows,
    app.id,
    apps,
    openWindow,
    focusWindow,
    minimizeWindow,
    restoreWindow,
  ])

  const { itemSize } = theme.dock

  return (
    <div style={{ position: 'relative' }}>
      <motion.button
        onClick={onClick}
        animate={bounceControls}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          background: hovered ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: 6,
          borderRadius: itemSize * 0.2,
          transition: 'background 0.15s ease',
        }}
      >
        <AppIcon icon={app.icon} size={itemSize} borderRadius={itemSize * 0.2} />
        {hasWindow && (
          <div
            style={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: theme.dock.runningIndicatorColor,
            }}
          />
        )}
      </motion.button>

      {/* Tooltip */}
      {hovered && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: 6,
            padding: '4px 10px',
            background: 'rgba(0, 0, 0, 0.75)',
            color: '#fff',
            fontSize: 12,
            fontWeight: 500,
            borderRadius: 4,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
        >
          {app.label}
        </div>
      )}
    </div>
  )
}
