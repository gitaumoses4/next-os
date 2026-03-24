'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useHighContrast } from '@/hooks/useHighContrast'
import { useOSStore } from '@/store/windowStore'
import { useOSContext } from '@/context/OSContext'
import { WindowTitlebar } from './WindowTitlebar'
import { WindowContent } from './WindowContent'
import { WindowResizeHandles } from './WindowResizeHandles'
import { AppIcon } from '@/components/shared/AppIcon'

interface WindowProps {
  windowId: string
}

export function Window({ windowId }: WindowProps) {
  const { theme, apps } = useOSContext()
  const win = useOSStore((s) => s.windows[windowId])
  const allWindows = useOSStore((s) => s.windows)
  const switchTab = useOSStore((s) => s.switchTab)
  const ungroupWindow = useOSStore((s) => s.ungroupWindow)
  const focusWindow = useOSStore((s) => s.focusWindow)
  const isDragging = useOSStore((s) => s.draggingWindowId === windowId)
  const isShaking = useOSStore((s) => s.shakeWindowId === windowId)
  const prefersReducedMotion = useReducedMotion()
  const highContrast = useHighContrast()

  if (!win) return null

  const app = apps.find((a) => a.id === win.appId)
  if (!app) return null

  const isResizable = app.resizable !== false && win.status !== 'maximized' && !win.isPip
  const { windowChrome } = theme
  const isFocused = win.isFocused

  const isMaximized = win.status === 'maximized'
  const isPip = win.isPip

  // Tab grouping: hide inactive tabs
  if (win.tabGroupId && !win.isActiveTab) return null

  // Get sibling tabs for tab bar
  const tabSiblings = win.tabGroupId
    ? Object.values(allWindows).filter((w) => w.tabGroupId === win.tabGroupId)
    : null

  return (
    <motion.div
      role="dialog"
      aria-label={win.title}
      aria-modal={false}
      data-window-id={windowId}
      variants={{
        ...theme.animation.windowOpen,
        ...theme.animation.windowClose,
      }}
      initial="initial"
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
        left: win.position.x,
        top: win.position.y,
        width: win.size.w,
        height: win.size.h,
        borderRadius: isMaximized ? 0 : parseInt(windowChrome.borderRadius) || 0,
      }}
      exit="exit"
      transition={
        isDragging || prefersReducedMotion
          ? {
              left: { duration: 0 },
              top: { duration: 0 },
              width: { duration: 0 },
              height: { duration: 0 },
              opacity: { duration: prefersReducedMotion ? 0.1 : 0 },
              scale: { duration: 0 },
            }
          : {
              left: { type: 'tween', duration: 0.2, ease: [0.2, 0.8, 0.2, 1] },
              top: { type: 'tween', duration: 0.2, ease: [0.2, 0.8, 0.2, 1] },
              width: { type: 'tween', duration: 0.2, ease: [0.2, 0.8, 0.2, 1] },
              height: { type: 'tween', duration: 0.2, ease: [0.2, 0.8, 0.2, 1] },
              borderRadius: { type: 'tween', duration: 0.2 },
            }
      }
      onPointerDown={() => focusWindow(windowId)}
      style={{
        position: 'absolute',
        zIndex: win.zIndex,
        display: win.status === 'minimized' ? 'none' : 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        borderRadius: windowChrome.borderRadius,
        boxShadow: isFocused
          ? `${windowChrome.shadowFocused}, 0 0 0 1px ${theme.tokens['accent-color'] ?? 'rgba(99, 102, 241, 0.3)'}`
          : windowChrome.shadow,
        border: windowChrome.border,
        background: windowChrome.glassBg,
        backdropFilter: windowChrome.glassBlur,
        WebkitBackdropFilter: windowChrome.glassBlur,
        filter: isFocused || highContrast ? 'none' : windowChrome.unfocusedFilter,
        transition: 'filter 0.2s ease, box-shadow 0.25s ease',
        animation: isShaking ? 'nos-shake 0.4s ease' : undefined,
        outline: highContrast
          ? isFocused
            ? '3px solid currentColor'
            : '2px solid currentColor'
          : undefined,
      }}
    >
      {!isPip && <WindowTitlebar windowId={windowId} app={app} />}
      {/* Tab bar for grouped windows */}
      {tabSiblings && tabSiblings.length > 1 && (
        <div
          style={{
            display: 'flex',
            background: windowChrome.titlebarBgUnfocused,
            borderBottom: windowChrome.border,
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          {tabSiblings.map((tab) => {
            const tabApp = apps.find((a) => a.id === tab.appId)
            return (
              <button
                key={tab.id}
                onClick={() => switchTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '4px 12px',
                  border: 'none',
                  borderBottom: tab.isActiveTab
                    ? `2px solid ${theme.tokens['accent-color'] ?? '#007aff'}`
                    : '2px solid transparent',
                  background: tab.isActiveTab ? windowChrome.titlebarBg : 'transparent',
                  color: windowChrome.titlebarTextColor,
                  fontSize: 11,
                  cursor: 'pointer',
                  opacity: tab.isActiveTab ? 1 : 0.6,
                  maxWidth: 150,
                  overflow: 'hidden',
                }}
              >
                {tabApp && <AppIcon icon={tabApp.icon} size={12} />}
                <span
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tab.title}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    ungroupWindow(tab.id)
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'inherit',
                    fontSize: 10,
                    cursor: 'pointer',
                    padding: 0,
                    marginLeft: 2,
                    opacity: 0.5,
                  }}
                >
                  ×
                </button>
              </button>
            )
          })}
        </div>
      )}
      <WindowContent
        windowId={windowId}
        appId={app.id}
        route={app.route}
        component={app.component}
        skeleton={app.skeleton}
      />
      {/* Transparent overlay to capture clicks when unfocused (iframe swallows pointer events) */}
      {!isFocused && !app.component && (
        <div
          onPointerDown={() => focusWindow(windowId)}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
          }}
        />
      )}
      {isResizable && <WindowResizeHandles windowId={windowId} />}
    </motion.div>
  )
}
