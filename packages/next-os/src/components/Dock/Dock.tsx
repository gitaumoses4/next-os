'use client'

import { useState, useCallback } from 'react'
import { useOSContext } from '@/context/OSContext'
import { DockItem } from './DockItem'

export function Dock() {
  const { apps, theme } = useOSContext()
  const { height, bg, blur, borderRadius, padding, gap, position } = theme.dock
  const [mouseX, setMouseX] = useState<number | null>(null)

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    setMouseX(e.clientX)
  }, [])

  const onMouseLeave = useCallback(() => {
    setMouseX(null)
  }, [])

  return (
    <div
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        position: 'absolute',
        [position]: 8,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'flex-end',
        gap,
        height,
        padding,
        background: bg,
        backdropFilter: blur,
        WebkitBackdropFilter: blur,
        borderRadius,
        border: '1px solid rgba(255, 255, 255, 0.15)',
      }}
    >
      {apps.map((app, i) => (
        <DockItem key={app.id} app={app} mouseX={mouseX} index={i} totalItems={apps.length} />
      ))}
    </div>
  )
}
