'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ContextMenuTheme } from '@/themes/types'

export interface ContextMenuItem {
  label: string
  shortcut?: string
  action?: () => void
  danger?: boolean
  disabled?: boolean
  separator?: boolean
}

interface ContextMenuProps {
  items: ContextMenuItem[]
  position: { x: number; y: number } | null
  onClose: () => void
  theme: ContextMenuTheme
}

export function ContextMenu({ items, position, onClose, theme: cm }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const [adjustedPos, setAdjustedPos] = useState(position)
  const [selectedIndex, setSelectedIndex] = useState(-1)

  // Adjust position to keep menu in viewport
  useEffect(() => {
    if (!position || !menuRef.current) {
      setAdjustedPos(position)
      return
    }
    const rect = menuRef.current.getBoundingClientRect()
    const x = Math.min(position.x, window.innerWidth - rect.width - 8)
    const y = Math.min(position.y, window.innerHeight - rect.height - 8)
    setAdjustedPos({ x: Math.max(8, x), y: Math.max(8, y) })
  }, [position])

  // Close on click outside
  useEffect(() => {
    if (!position) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    window.addEventListener('mousedown', handler)
    return () => window.removeEventListener('mousedown', handler)
  }, [position, onClose])

  // Keyboard navigation
  useEffect(() => {
    if (!position) return
    const actionItems = items
      .map((item, i) => ({ item, i }))
      .filter(({ item }) => !item.separator && !item.disabled)

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        const currentActionIdx = actionItems.findIndex(({ i }) => i === selectedIndex)
        const next = actionItems[(currentActionIdx + 1) % actionItems.length]
        setSelectedIndex(next.i)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        const currentActionIdx = actionItems.findIndex(({ i }) => i === selectedIndex)
        const prev = actionItems[(currentActionIdx - 1 + actionItems.length) % actionItems.length]
        setSelectedIndex(prev.i)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const item = items[selectedIndex]
        if (item && !item.disabled && !item.separator && item.action) {
          item.action()
          onClose()
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [position, items, selectedIndex, onClose])

  return (
    <AnimatePresence>
      {position && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.1 }}
          style={{
            position: 'fixed',
            left: adjustedPos?.x ?? position.x,
            top: adjustedPos?.y ?? position.y,
            zIndex: 9997,
            minWidth: 200,
            background: cm.bg,
            backdropFilter: cm.blur,
            WebkitBackdropFilter: cm.blur,
            border: cm.border,
            borderRadius: cm.borderRadius,
            boxShadow: cm.shadow,
            padding: '4px 0',
            overflow: 'hidden',
          }}
        >
          {items.map((item, i) =>
            item.separator ? (
              <div
                key={`sep-${i}`}
                style={{
                  height: 1,
                  background: cm.separatorColor,
                  margin: '4px 8px',
                }}
              />
            ) : (
              <button
                key={`${item.label}-${i}`}
                onClick={() => {
                  if (!item.disabled && item.action) {
                    item.action()
                    onClose()
                  }
                }}
                onMouseEnter={() => !item.disabled && setSelectedIndex(i)}
                onMouseLeave={() => setSelectedIndex(-1)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  padding: '6px 14px',
                  border: 'none',
                  background:
                    i === selectedIndex
                      ? item.danger
                        ? cm.dangerHoverBg
                        : cm.itemHoverBg
                      : 'transparent',
                  color: item.disabled
                    ? cm.itemDisabledColor
                    : item.danger
                      ? cm.dangerColor
                      : i === selectedIndex
                        ? cm.itemHoverColor
                        : cm.itemColor,
                  fontSize: 13,
                  textAlign: 'left',
                  cursor: item.disabled ? 'default' : 'pointer',
                  gap: 8,
                }}
              >
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.shortcut && (
                  <span style={{ fontSize: 11, color: cm.shortcutColor }}>{item.shortcut}</span>
                )}
              </button>
            ),
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
