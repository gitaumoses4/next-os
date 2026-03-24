'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useOSContext } from '@/context/OSContext'
import { useOSStore } from '@/store/windowStore'
import { DockItem } from './DockItem'
import type { AppDefinition, DockEntry } from '@/types'

const HOVER_ZONE_SIZE = 8

interface DockProps {
  dockItems?: DockEntry[]
}

export function Dock({ dockItems }: DockProps) {
  const { apps, theme } = useOSContext()
  const { height, bg, blur, borderRadius, padding, gap, position, border, autoHide } = theme.dock
  const windows = useOSStore((s) => s.windows)
  const [hovered, setHovered] = useState(false)

  // Use dockItems if provided, otherwise derive from apps
  const items: DockEntry[] = dockItems ?? apps

  const hasIntersectingWindow = (() => {
    if (!autoHide) return false
    const dockTop = position === 'bottom' ? window.innerHeight - height - 16 : 0
    const dockBottom = position === 'bottom' ? window.innerHeight : height + 16

    return Object.values(windows).some((win) => {
      if (win.status === 'minimized') return false
      const winBottom = win.position.y + win.size.h
      const winTop = win.position.y
      return winBottom > dockTop && winTop < dockBottom
    })
  })()

  const shouldHide = autoHide && hasIntersectingWindow && !hovered

  useEffect(() => {
    if (!autoHide) return

    const handler = (e: MouseEvent) => {
      const atEdge =
        position === 'bottom'
          ? e.clientY >= window.innerHeight - HOVER_ZONE_SIZE
          : e.clientY <= HOVER_ZONE_SIZE

      if (atEdge) {
        setHovered(true)
      }
    }

    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [autoHide, position])

  const hiddenOffset = height + 20
  const isBottom = position === 'bottom'

  return (
    <div
      style={{
        position: 'absolute',
        [position]: 8,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 200,
      }}
    >
      <motion.div
        role="toolbar"
        aria-label="Dock"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        animate={{
          y: shouldHide ? (isBottom ? hiddenOffset : -hiddenOffset) : 0,
          opacity: shouldHide ? 0 : 1,
        }}
        transition={{ type: 'tween', duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap,
          height,
          padding,
          background: bg,
          backdropFilter: blur,
          WebkitBackdropFilter: blur,
          borderRadius,
          border,
        }}
      >
        {items.map((entry, i) =>
          'type' in entry && entry.type === 'separator' ? (
            <div
              key={`sep-${i}`}
              style={{
                width: 1,
                height: '60%',
                background: theme.dock.runningIndicatorColor,
                opacity: 0.4,
                flexShrink: 0,
              }}
            />
          ) : (
            <DockItem key={(entry as AppDefinition).id} app={entry as AppDefinition} />
          ),
        )}
      </motion.div>
    </div>
  )
}
