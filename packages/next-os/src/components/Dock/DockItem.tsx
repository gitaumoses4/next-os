'use client'

import { forwardRef, useCallback, useEffect, useRef } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useOSStore } from '@/store/windowStore'
import { useOSContext } from '@/context/OSContext'
import type { AppDefinition } from '@/types'

interface DockItemProps {
  app: AppDefinition
  scale: number
  gap: number
}

export const DockItem = forwardRef<HTMLButtonElement, DockItemProps>(function DockItem(
  { app, scale, gap },
  ref,
) {
  const { theme, apps } = useOSContext()
  const windows = useOSStore((s) => s.windows)
  const openWindow = useOSStore((s) => s.openWindow)
  const focusWindow = useOSStore((s) => s.focusWindow)
  const minimizeWindow = useOSStore((s) => s.minimizeWindow)
  const restoreWindow = useOSStore((s) => s.restoreWindow)
  const bounceControls = useAnimation()
  const prevWindowCountRef = useRef(0)

  const appWindows = Object.values(windows).filter((w) => w.appId === app.id)
  const hasWindow = appWindows.length > 0
  const focusedWindow = appWindows.find((w) => w.isFocused)
  const minimizedWindow = appWindows.find((w) => w.status === 'minimized')

  // Bounce animation when a new window opens for this app
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
  const scaledSize = itemSize * scale

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      animate={bounceControls}
      title={app.label}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 2,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: `0 ${gap / 2}px`,
        width: scaledSize + gap,
        transition: 'width 0.15s ease',
      }}
    >
      <motion.img
        src={app.icon}
        alt={app.label}
        style={{
          width: scaledSize,
          height: scaledSize,
          objectFit: 'contain',
          borderRadius: scaledSize * 0.2,
          transformOrigin: 'bottom center',
        }}
        draggable={false}
      />
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
  )
})
