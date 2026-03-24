'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, useAnimation, useReducedMotion, AnimatePresence } from 'framer-motion'
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
  const shakeWindow = useOSStore((s) => s.shakeWindow)
  const bounceControls = useAnimation()
  const prevWindowCountRef = useRef(0)
  const [hovered, setHovered] = useState(false)
  const [popupOpen, setPopupOpen] = useState(false)
  const buttonRef = useRef<HTMLDivElement>(null)

  const appWindows = Object.values(windows).filter((w) => w.appId === app.id)
  const hasWindow = appWindows.length > 0
  const focusedWindow = appWindows.find((w) => w.isFocused)
  const minimizedWindow = appWindows.find((w) => w.status === 'minimized')
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) return
    if (appWindows.length > prevWindowCountRef.current && appWindows.length > 0) {
      bounceControls.start({
        y: [0, -20, 0, -12, 0, -6, 0],
        transition: { duration: 0.4, ease: 'easeInOut' },
      })
    }
    prevWindowCountRef.current = appWindows.length
  }, [appWindows.length, bounceControls, prefersReducedMotion])

  const onClick = useCallback(() => {
    if (!hasWindow) {
      openWindow(app.id, apps)
    } else if (minimizedWindow) {
      restoreWindow(minimizedWindow.id)
    } else if (appWindows.length > 1) {
      // Multiple windows: show popup to pick one
      setPopupOpen((v) => !v)
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
    shakeWindow,
  ])

  const badge = useOSStore((s) => s.badges[app.id] ?? 0)
  const { itemSize } = theme.dock

  return (
    <div ref={buttonRef} style={{ position: 'relative' }}>
      <motion.button
        onClick={onClick}
        animate={bounceControls}
        aria-label={app.label}
        aria-pressed={hasWindow}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          background: hovered ? theme.dock.hoverBg : 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: 6,
          borderRadius: itemSize * 0.2,
          transition: 'background 0.15s ease',
        }}
      >
        <div style={{ position: 'relative' }}>
          <AppIcon icon={app.icon} size={itemSize} borderRadius={itemSize * 0.2} />
          {badge > 0 && (
            <div
              style={{
                position: 'absolute',
                top: -4,
                right: -4,
                minWidth: 16,
                height: 16,
                borderRadius: 8,
                background: theme.dock.badgeBg,
                color: theme.dock.badgeColor,
                fontSize: 10,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 4px',
                lineHeight: 1,
              }}
            >
              {badge > 99 ? '99+' : badge}
            </div>
          )}
        </div>
        {hasWindow && (
          <div style={{ display: 'flex', gap: 2 }}>
            {Array.from({ length: Math.min(appWindows.length, 3) }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  background: theme.dock.runningIndicatorColor,
                }}
              />
            ))}
          </div>
        )}
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.12 }}
            style={{
              position: 'absolute',
              bottom: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginBottom: 6,
              padding: '4px 10px',
              background: theme.dock.tooltipBg,
              color: theme.dock.tooltipColor,
              fontSize: 12,
              fontWeight: 500,
              borderRadius: 4,
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
            }}
          >
            {app.label}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Window list popup for multiple windows */}
      {popupOpen &&
        appWindows.length > 1 &&
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
                  left: buttonRef.current
                    ? buttonRef.current.getBoundingClientRect().left +
                      buttonRef.current.getBoundingClientRect().width / 2 -
                      100
                    : 0,
                  bottom: buttonRef.current
                    ? window.innerHeight - buttonRef.current.getBoundingClientRect().top + 8
                    : 80,
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
                {appWindows.map((win) => (
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
    </div>
  )
}
