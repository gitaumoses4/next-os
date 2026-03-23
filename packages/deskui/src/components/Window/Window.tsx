'use client'

import { motion } from 'framer-motion'
import { useOSStore } from '@/store/windowStore'
import { useOSContext } from '@/context/OSContext'
import { WindowTitlebar } from './WindowTitlebar'
import { WindowContent } from './WindowContent'
import { WindowResizeHandles } from './WindowResizeHandles'

interface WindowProps {
  windowId: string
}

export function Window({ windowId }: WindowProps) {
  const { theme, apps } = useOSContext()
  const win = useOSStore((s) => s.windows[windowId])
  const focusWindow = useOSStore((s) => s.focusWindow)
  const isDragging = useOSStore((s) => s.draggingWindowId === windowId)

  if (!win) return null

  const app = apps.find((a) => a.id === win.appId)
  if (!app) return null

  const isResizable = app.resizable !== false && win.status !== 'maximized'
  const { windowChrome } = theme
  const isFocused = win.isFocused

  const dockHeight = theme.dock.height
  const isMaximized = win.status === 'maximized'

  return (
    <motion.div
      variants={{
        ...theme.animation.windowOpen,
        ...theme.animation.windowClose,
      }}
      initial="initial"
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
        left: isMaximized ? 0 : win.position.x,
        top: isMaximized ? 0 : win.position.y,
        width: isMaximized ? window.innerWidth : win.size.w,
        height: isMaximized ? window.innerHeight - dockHeight : win.size.h,
        borderRadius: isMaximized ? 0 : parseInt(windowChrome.borderRadius) || 12,
      }}
      exit="exit"
      transition={
        isDragging
          ? {
              left: { duration: 0 },
              top: { duration: 0 },
              width: { duration: 0 },
              height: { duration: 0 },
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
        boxShadow: isFocused ? windowChrome.shadowFocused : windowChrome.shadow,
        border: windowChrome.border,
        background: windowChrome.glassBg,
        backdropFilter: windowChrome.glassBlur,
        WebkitBackdropFilter: windowChrome.glassBlur,
      }}
    >
      <WindowTitlebar windowId={windowId} />
      <WindowContent route={app.route} />
      {isResizable && <WindowResizeHandles windowId={windowId} />}
    </motion.div>
  )
}
