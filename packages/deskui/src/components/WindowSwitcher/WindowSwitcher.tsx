'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useOSStore } from '@/store/windowStore'
import { useOSContext } from '@/context/OSContext'
import { AppIcon } from '@/components/shared/AppIcon'

export function WindowSwitcher() {
  const { apps, theme } = useOSContext()
  const store = useOSStore()
  const [open, setOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const cp = theme.commandPalette

  const visibleWindows = store.zStack
    .filter((id) => store.windows[id]?.status !== 'minimized')
    .map((id) => store.windows[id])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey

      if (mod && e.key === 'Tab') {
        e.preventDefault()

        if (!open) {
          setOpen(true)
          setSelectedIndex(
            e.shiftKey ? visibleWindows.length - 1 : visibleWindows.length > 1 ? 1 : 0,
          )
        } else {
          setSelectedIndex((prev) =>
            e.shiftKey
              ? (prev - 1 + visibleWindows.length) % visibleWindows.length
              : (prev + 1) % visibleWindows.length,
          )
        }
      }
    },
    [open, visibleWindows.length],
  )

  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return
      // When modifier key is released, focus the selected window and close
      if (e.key === 'Control' || e.key === 'Meta') {
        const win = visibleWindows[selectedIndex]
        if (win) {
          store.focusWindow(win.id)
        }
        setOpen(false)
      }
    },
    [open, selectedIndex, visibleWindows, store],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [handleKeyDown, handleKeyUp])

  if (visibleWindows.length < 2) return null

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: cp.overlayBg,
              zIndex: 9990,
            }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.12, ease: [0.2, 0.8, 0.2, 1] }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 9991,
              display: 'flex',
              gap: 12,
              padding: 16,
              background: cp.bg,
              backdropFilter: cp.blur,
              WebkitBackdropFilter: cp.blur,
              border: cp.border,
              borderRadius: cp.borderRadius,
              boxShadow: cp.shadow,
            }}
          >
            {visibleWindows.map((win, i) => {
              const app = apps.find((a) => a.id === win.appId)
              const isSelected = i === selectedIndex
              return (
                <div
                  key={win.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    padding: 12,
                    borderRadius: 10,
                    background: isSelected ? cp.itemHoverBg : 'transparent',
                    minWidth: 80,
                    cursor: 'pointer',
                    transition: 'background 0.1s ease',
                  }}
                  onClick={() => {
                    store.focusWindow(win.id)
                    setOpen(false)
                  }}
                >
                  <div style={{ width: 48, height: 48 }}>
                    {app && <AppIcon icon={app.icon} size={48} />}
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      color: cp.itemColor,
                      maxWidth: 80,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      textAlign: 'center',
                    }}
                  >
                    {win.title}
                  </span>
                </div>
              )
            })}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
