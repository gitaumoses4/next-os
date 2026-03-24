'use client'

import { useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useOSStore } from '@/store/windowStore'
import { useOSContext } from '@/context/OSContext'
import { AppIcon } from '@/components/shared/AppIcon'
import type { WindowState } from '@/store/windowStore'
import type { AppDefinition } from '@/types'

interface TaskbarGroupProps {
  app: AppDefinition
  windows: WindowState[]
}

export function TaskbarGroup({ app, windows }: TaskbarGroupProps) {
  const { theme } = useOSContext()
  const focusWindow = useOSStore((s) => s.focusWindow)
  const minimizeWindow = useOSStore((s) => s.minimizeWindow)
  const { itemActiveBg, textColor } = theme.taskbar
  const [popupOpen, setPopupOpen] = useState(false)
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null)

  const hasFocused = windows.some((w) => w.isFocused)

  const onClick = useCallback(
    (e: React.MouseEvent) => {
      if (windows.length === 1) {
        const win = windows[0]
        if (win.isFocused) minimizeWindow(win.id)
        else focusWindow(win.id)
      } else {
        setButtonRect(e.currentTarget.getBoundingClientRect())
        setPopupOpen((v) => !v)
      }
    },
    [windows, focusWindow, minimizeWindow],
  )

  return (
    <>
      <button
        onClick={onClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 12px',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
          background: hasFocused ? itemActiveBg : 'transparent',
          color: textColor,
          fontSize: 12,
          maxWidth: 180,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <AppIcon icon={app.icon} size={16} />
        <span
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {app.label}
        </span>
        {windows.length > 1 && (
          <span
            style={{
              fontSize: 10,
              opacity: 0.6,
              marginLeft: 2,
            }}
          >
            {windows.length}
          </span>
        )}
      </button>

      {/* Popup for grouped windows */}
      {popupOpen &&
        buttonRect &&
        typeof document !== 'undefined' &&
        createPortal(
          <>
            <div
              onClick={() => setPopupOpen(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 9996 }}
            />
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.12 }}
                style={{
                  position: 'fixed',
                  left: buttonRect.left,
                  bottom: window.innerHeight - buttonRect.top + 4,
                  zIndex: 9997,
                  background: theme.contextMenu.bg,
                  backdropFilter: theme.contextMenu.blur,
                  WebkitBackdropFilter: theme.contextMenu.blur,
                  border: theme.contextMenu.border,
                  borderRadius: theme.contextMenu.borderRadius,
                  boxShadow: theme.contextMenu.shadow,
                  padding: '4px 0',
                  minWidth: 200,
                }}
              >
                {windows.map((win) => (
                  <button
                    key={win.id}
                    onClick={() => {
                      focusWindow(win.id)
                      setPopupOpen(false)
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      width: '100%',
                      padding: '6px 14px',
                      border: 'none',
                      background: win.isFocused ? theme.contextMenu.itemHoverBg : 'transparent',
                      color: win.isFocused
                        ? theme.contextMenu.itemHoverColor
                        : theme.contextMenu.itemColor,
                      fontSize: 13,
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    <AppIcon icon={app.icon} size={14} />
                    <span
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {win.title}
                    </span>
                  </button>
                ))}
              </motion.div>
            </AnimatePresence>
          </>,
          document.body,
        )}
    </>
  )
}
