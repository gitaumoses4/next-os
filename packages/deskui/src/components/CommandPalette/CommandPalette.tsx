'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useOSStore } from '@/store/windowStore'
import { useOSContext } from '@/context/OSContext'
import { AppIcon } from '@/components/shared/AppIcon'

interface CommandItem {
  id: string
  label: string
  icon: React.ReactNode
  type: 'app' | 'window' | 'action'
  action: () => void
}

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const { apps, theme } = useOSContext()
  const store = useOSStore()
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const cp = theme.commandPalette

  const items: CommandItem[] = []

  for (const app of apps) {
    items.push({
      id: `app-${app.id}`,
      label: `Open ${app.label}`,
      icon: app.icon,
      type: 'app',
      action: () => {
        store.openWindow(app.id, apps)
        onClose()
      },
    })
  }

  for (const win of Object.values(store.windows)) {
    const app = apps.find((a) => a.id === win.appId)
    items.push({
      id: `win-${win.id}`,
      label: `Focus: ${win.title}`,
      icon: app?.icon ?? null,
      type: 'window',
      action: () => {
        store.focusWindow(win.id)
        onClose()
      },
    })
  }

  items.push({
    id: 'action-show-desktop',
    label: 'Show Desktop',
    icon: '🖥️',
    type: 'action',
    action: () => {
      store.showDesktop()
      onClose()
    },
  })

  items.push({
    id: 'action-close-all',
    label: 'Close All Windows',
    icon: '✕',
    type: 'action',
    action: () => {
      for (const id of Object.keys(store.windows)) {
        store.closeWindow(id)
      }
      onClose()
    },
  })

  const filtered = query
    ? items.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))
    : items

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  useEffect(() => {
    if (open) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  const runSelected = useCallback(() => {
    if (filtered[selectedIndex]) {
      filtered[selectedIndex].action()
    }
  }, [filtered, selectedIndex])

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((i) => Math.max(i - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        runSelected()
      } else if (e.key === 'Escape') {
        onClose()
      }
    },
    [filtered.length, runSelected, onClose],
  )

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: cp.overlayBg,
              zIndex: 9998,
            }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
            style={{
              position: 'fixed',
              top: '20%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 520,
              maxHeight: 420,
              zIndex: 9999,
              background: cp.bg,
              backdropFilter: cp.blur,
              WebkitBackdropFilter: cp.blur,
              borderRadius: cp.borderRadius,
              border: cp.border,
              boxShadow: cp.shadow,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
            onKeyDown={onKeyDown}
          >
            <div style={{ padding: '14px 16px', borderBottom: `1px solid ${cp.separatorColor}` }}>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search apps, windows, actions..."
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: cp.inputColor,
                  fontSize: 16,
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div style={{ flex: 1, overflow: 'auto', padding: '6px 0' }}>
              {filtered.length === 0 && (
                <div
                  style={{
                    padding: '20px 16px',
                    color: cp.inputPlaceholderColor,
                    fontSize: 14,
                    textAlign: 'center',
                  }}
                >
                  No results
                </div>
              )}
              {filtered.map((item, i) => (
                <button
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(i)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    width: '100%',
                    padding: '8px 16px',
                    border: 'none',
                    background: i === selectedIndex ? cp.itemHoverBg : 'transparent',
                    color: cp.itemColor,
                    fontSize: 14,
                    textAlign: 'left',
                    cursor: 'pointer',
                    borderRadius: 0,
                  }}
                >
                  <div style={{ width: 28, height: 28, flexShrink: 0 }}>
                    {typeof item.icon === 'string' ? (
                      <span style={{ fontSize: 20, lineHeight: '28px' }}>{item.icon}</span>
                    ) : (
                      <AppIcon icon={item.icon} size={28} />
                    )}
                  </div>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  <span
                    style={{ fontSize: 11, color: cp.itemBadgeColor, textTransform: 'capitalize' }}
                  >
                    {item.type}
                  </span>
                </button>
              ))}
            </div>

            <div
              style={{
                padding: '8px 16px',
                borderTop: `1px solid ${cp.separatorColor}`,
                display: 'flex',
                gap: 16,
                fontSize: 11,
                color: cp.hintColor,
              }}
            >
              <span>↑↓ Navigate</span>
              <span>↵ Open</span>
              <span>Esc Close</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
