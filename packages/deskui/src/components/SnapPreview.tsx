'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useOSStore } from '@/store/windowStore'
import { useOSContext } from '@/context/OSContext'

export function SnapPreview() {
  const snapPreview = useOSStore((s) => s.snapPreview)
  const { theme, taskbarVariant } = useOSContext()

  if (!snapPreview) return null

  const barHeight = taskbarVariant === 'dock' ? theme.dock.height : theme.taskbar.height
  const barPosition = taskbarVariant === 'dock' ? theme.dock.position : theme.taskbar.position
  const topOffset = barPosition === 'top' ? barHeight : 0

  const vw = window.innerWidth
  const vh = window.innerHeight - barHeight
  const halfW = Math.round(vw / 2)
  const halfH = Math.round(vh / 2)

  const zoneStyles: Record<string, React.CSSProperties> = {
    left: { left: 0, top: topOffset, width: halfW, height: vh },
    right: { left: halfW, top: topOffset, width: halfW, height: vh },
    top: { left: 0, top: topOffset, width: vw, height: vh },
    'top-left': { left: 0, top: topOffset, width: halfW, height: halfH },
    'top-right': { left: halfW, top: topOffset, width: halfW, height: halfH },
    'bottom-left': { left: 0, top: topOffset + halfH, width: halfW, height: halfH },
    'bottom-right': { left: halfW, top: topOffset + halfH, width: halfW, height: halfH },
  }

  const style = zoneStyles[snapPreview]
  if (!style) return null

  return (
    <AnimatePresence>
      <motion.div
        key={snapPreview}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        style={{
          position: 'absolute',
          ...style,
          zIndex: 99,
          background: theme.tokens['accent-color']
            ? `${theme.tokens['accent-color']}20`
            : 'rgba(99, 102, 241, 0.12)',
          border: `2px solid ${theme.tokens['accent-color'] ?? 'rgba(99, 102, 241, 0.4)'}`,
          borderRadius: 8,
          pointerEvents: 'none',
          margin: 4,
        }}
      />
    </AnimatePresence>
  )
}
