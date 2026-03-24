'use client'

import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useOSStore } from '@/store/windowStore'
import { useOSContext } from '@/context/OSContext'
import { AppIcon } from '@/components/shared/AppIcon'

const THUMBNAIL_W = 240
const THUMBNAIL_H = 160
const GAP = 24

export function MissionControl() {
  const active = useOSStore((s) => s.missionControlActive)
  const toggleMissionControl = useOSStore((s) => s.toggleMissionControl)
  const focusWindow = useOSStore((s) => s.focusWindow)
  const windows = useOSStore((s) => s.windows)
  const zStack = useOSStore((s) => s.zStack)
  const { theme, apps } = useOSContext()
  const cp = theme.commandPalette

  const visibleWindows = useMemo(
    () => zStack.filter((id) => windows[id]?.status !== 'minimized').map((id) => windows[id]),
    [zStack, windows],
  )

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={toggleMissionControl}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9980,
            background: cp.overlayBg,
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 60,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              gap: GAP,
              maxWidth: (THUMBNAIL_W + GAP) * 4,
            }}
          >
            {visibleWindows.map((win) => {
              const app = apps.find((a) => a.id === win.appId)

              return (
                <motion.div
                  key={win.id}
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.85, opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
                  onClick={(e) => {
                    e.stopPropagation()
                    focusWindow(win.id)
                    toggleMissionControl()
                  }}
                  whileHover={{ scale: 1.05 }}
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    width: THUMBNAIL_W,
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    style={{
                      width: THUMBNAIL_W,
                      height: THUMBNAIL_H,
                      background: theme.windowChrome.glassBg,
                      border: win.isFocused
                        ? `2px solid ${theme.tokens['accent-color'] ?? '#6366f1'}`
                        : theme.windowChrome.border,
                      borderRadius: theme.windowChrome.borderRadius,
                      boxShadow: theme.windowChrome.shadow,
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {/* Mini titlebar */}
                    <div
                      style={{
                        height: 20,
                        background: theme.windowChrome.titlebarBg,
                        borderBottom: theme.windowChrome.border,
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 6px',
                        gap: 4,
                      }}
                    >
                      {app && (
                        <div style={{ width: 10, height: 10, flexShrink: 0 }}>
                          <AppIcon icon={app.icon} size={10} />
                        </div>
                      )}
                      <span
                        style={{
                          fontSize: 9,
                          color: theme.windowChrome.titlebarTextColor,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {win.title}
                      </span>
                    </div>
                    {/* Content area */}
                    <div style={{ flex: 1, background: theme.windowChrome.contentBg }} />
                  </div>

                  {/* Label */}
                  <span
                    style={{
                      fontSize: 11,
                      color: theme.desktop.iconLabelColor,
                      fontWeight: 500,
                      textAlign: 'center',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: THUMBNAIL_W,
                    }}
                  >
                    {win.title}
                  </span>
                </motion.div>
              )
            })}
          </div>

          {visibleWindows.length === 0 && (
            <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 14 }}>No open windows</span>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
