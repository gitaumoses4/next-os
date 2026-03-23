'use client'

import { useState, useCallback, useRef } from 'react'
import { useOSContext } from '@/context/OSContext'
import { DockItem } from './DockItem'

function getScale(mouseX: number | null, itemCenterX: number, itemSize: number): number {
  if (mouseX === null) return 1
  const distance = Math.abs(mouseX - itemCenterX)
  const maxScale = 1.5
  const radius = itemSize * 3
  return 1 + Math.max(0, (maxScale - 1) * (1 - distance / radius))
}

export function Dock() {
  const { apps, theme } = useOSContext()
  const { height, bg, blur, borderRadius, padding, gap, position, itemSize, magnification } =
    theme.dock
  const [mouseX, setMouseX] = useState<number | null>(null)
  const dockRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    setMouseX(e.clientX)
  }, [])

  const onMouseLeave = useCallback(() => {
    setMouseX(null)
  }, [])

  // Calculate scales for all items to determine dock width
  const scales = apps.map((_, i) => {
    if (!magnification || mouseX === null) return 1
    const el = itemRefs.current[i]
    if (!el) return 1
    const rect = el.getBoundingClientRect()
    const center = rect.left + rect.width / 2
    return getScale(mouseX, center, itemSize)
  })

  // Dynamic height to accommodate magnified icons
  const maxScale = Math.max(...scales)
  const dynamicHeight = magnification ? itemSize * maxScale + 24 : height

  return (
    <div
      ref={dockRef}
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
        gap: 0,
        minHeight: height,
        height: dynamicHeight,
        padding,
        background: bg,
        backdropFilter: blur,
        WebkitBackdropFilter: blur,
        borderRadius,
        border: '1px solid rgba(255, 255, 255, 0.15)',
        transition: mouseX === null ? 'height 0.2s ease' : undefined,
      }}
    >
      {apps.map((app, i) => (
        <DockItem
          key={app.id}
          ref={(el) => {
            itemRefs.current[i] = el
          }}
          app={app}
          scale={scales[i]}
          gap={gap}
        />
      ))}
    </div>
  )
}
