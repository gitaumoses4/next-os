'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useOSContext } from '@/context/OSContext'
import { deskuiEvents } from '@/utils/eventEmitter'

interface LockScreenProps {
  idleTimeout?: number
}

export function LockScreen({ idleTimeout }: LockScreenProps) {
  const { theme, wallpaper } = useOSContext()
  const [locked, setLocked] = useState(false)
  const [time, setTime] = useState('')
  const [date, setDate] = useState('')
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const updateClock = useCallback(() => {
    const now = new Date()
    setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    setDate(now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' }))
  }, [])

  useEffect(() => {
    updateClock()
    const interval = setInterval(updateClock, 30_000)
    return () => clearInterval(interval)
  }, [updateClock])

  const lock = useCallback(() => {
    setLocked(true)
    deskuiEvents.emit({ type: 'lock', locked: true })
  }, [])

  const unlock = useCallback(() => {
    setLocked(false)
    deskuiEvents.emit({ type: 'lock', locked: false })
  }, [])

  // Idle timeout
  useEffect(() => {
    if (!idleTimeout) return

    const resetTimer = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
      if (!locked) {
        idleTimerRef.current = setTimeout(lock, idleTimeout)
      }
    }

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll']
    events.forEach((e) => window.addEventListener(e, resetTimer))
    resetTimer()

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer))
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    }
  }, [idleTimeout, locked, lock])

  // Cmd/Ctrl+L to lock
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault()
        lock()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lock])

  const wallpaperStyle: React.CSSProperties = wallpaper
    ? wallpaper.startsWith('http') || wallpaper.startsWith('/')
      ? {
          backgroundImage: `url(${wallpaper})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }
      : { background: wallpaper }
    : { background: theme.desktop.defaultWallpaper }

  return (
    <AnimatePresence>
      {locked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={unlock}
          onKeyDown={(e) => {
            if (e.key) unlock()
          }}
          tabIndex={0}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            ...wallpaperStyle,
          }}
        >
          {/* Blur overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backdropFilter: 'blur(40px) brightness(0.7)',
              WebkitBackdropFilter: 'blur(40px) brightness(0.7)',
            }}
          />

          {/* Content */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            style={{
              position: 'relative',
              textAlign: 'center',
              color: '#ffffff',
            }}
          >
            <div
              style={{
                fontSize: 72,
                fontWeight: 200,
                letterSpacing: -2,
                lineHeight: 1,
                textShadow: '0 2px 20px rgba(0, 0, 0, 0.3)',
              }}
            >
              {time}
            </div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 400,
                marginTop: 8,
                opacity: 0.8,
                textShadow: '0 1px 8px rgba(0, 0, 0, 0.3)',
              }}
            >
              {date}
            </div>
            <div
              style={{
                fontSize: 13,
                marginTop: 40,
                opacity: 0.5,
              }}
            >
              Click anywhere or press any key to unlock
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
