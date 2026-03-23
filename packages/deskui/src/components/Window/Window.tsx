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
      animate="animate"
      exit="exit"
      onPointerDown={() => focusWindow(windowId)}
      style={{
        position: 'absolute',
        left: isMaximized ? 0 : win.position.x,
        top: isMaximized ? 0 : win.position.y,
        width: isMaximized ? '100%' : win.size.w,
        height: isMaximized ? `calc(100% - ${dockHeight}px)` : win.size.h,
        zIndex: win.zIndex,
        display: win.status === 'minimized' ? 'none' : 'flex',
        flexDirection: 'column',
        borderRadius: isMaximized ? 0 : windowChrome.borderRadius,
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
