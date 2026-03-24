'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useOSContext } from '@/context/OSContext'
import { DockItem } from './DockItem'

const AUTO_HIDE_DELAY = 800
const HOVER_ZONE_SIZE = 8

export function Dock() {
  const { apps, theme } = useOSContext()
  const { height, bg, blur, borderRadius, padding, gap, position, border, autoHide } = theme.dock
  const [visible, setVisible] = useState(!autoHide)
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dockRef = useRef<HTMLDivElement>(null)

  const cancelHideTimer = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current)
      hideTimerRef.current = null
    }
  }, [])

  const startHideTimer = useCallback(() => {
    if (!autoHide) return
    cancelHideTimer()
    hideTimerRef.current = setTimeout(() => setVisible(false), AUTO_HIDE_DELAY)
  }, [autoHide, cancelHideTimer])

  const onDockEnter = useCallback(() => {
    cancelHideTimer()
    setVisible(true)
  }, [cancelHideTimer])

  const onDockLeave = useCallback(() => {
    startHideTimer()
  }, [startHideTimer])

  // Edge hover zone to reveal dock when auto-hidden
  useEffect(() => {
    if (!autoHide) return

    const handler = (e: MouseEvent) => {
      const atEdge =
        position === 'bottom'
          ? e.clientY >= window.innerHeight - HOVER_ZONE_SIZE
          : e.clientY <= HOVER_ZONE_SIZE

      if (atEdge) {
        cancelHideTimer()
        setVisible(true)
      }
    }

    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [autoHide, position, cancelHideTimer])

  // Start hidden if auto-hide
  useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(() => setVisible(false), AUTO_HIDE_DELAY)
      return () => clearTimeout(timer)
    }
  }, [autoHide])

  const hiddenOffset = height + 20
  const isBottom = position === 'bottom'

  return (
    <motion.div
      ref={dockRef}
      onMouseEnter={onDockEnter}
      onMouseLeave={onDockLeave}
      animate={{
        y: visible ? 0 : isBottom ? hiddenOffset : -hiddenOffset,
        opacity: visible ? 1 : 0,
      }}
      transition={{ type: 'tween', duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
      style={{
        position: 'absolute',
        [position]: 8,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 200,
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
      {apps.map((app) => (
        <DockItem key={app.id} app={app} />
      ))}
    </motion.div>
  )
}
