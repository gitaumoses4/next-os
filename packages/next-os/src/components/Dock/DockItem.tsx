'use client'

import { useCallback, useEffect, useRef } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useOSStore } from '@/store/windowStore'
import { useOSContext } from '@/context/OSContext'
import type { AppDefinition } from '@/types'

interface DockItemProps {
  app: AppDefinition
  mouseX: number | null
  index: number
  totalItems: number
}

export function DockItem({ app, mouseX, index, totalItems }: DockItemProps) {
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

  // Magnification: calculate scale based on mouse distance
  const itemRef = useRef<HTMLButtonElement>(null)
  let scale = 1
  if (theme.dock.magnification && mouseX !== null && itemRef.current) {
    const rect = itemRef.current.getBoundingClientRect()
    const itemCenter = rect.left + rect.width / 2
    const distance = Math.abs(mouseX - itemCenter)
    const maxScale = 1.5
    const radius = theme.dock.itemSize * 3
    scale = 1 + Math.max(0, (maxScale - 1) * (1 - distance / radius))
  }

  return (
    <motion.button
      ref={itemRef}
      onClick={onClick}
      animate={bounceControls}
      title={app.label}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        transformOrigin: 'bottom center',
      }}
    >
      <motion.img
        src={app.icon}
        alt={app.label}
        animate={{ scale }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{
          width: theme.dock.itemSize,
          height: theme.dock.itemSize,
          objectFit: 'contain',
          borderRadius: theme.dock.itemSize * 0.2,
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
}
