'use client'

import { useOSContext } from '@/context/OSContext'
import { DockItem } from './DockItem'

export function Dock() {
  const { apps, theme } = useOSContext()
  const { height, bg, blur, borderRadius, padding, gap, position } = theme.dock

  return (
    <div
      style={{
        position: 'absolute',
        [position]: 8,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        gap,
        height,
        padding,
        background: bg,
        backdropFilter: blur,
        WebkitBackdropFilter: blur,
        borderRadius,
        border: theme.dock.border,
      }}
    >
      {apps.map((app) => (
        <DockItem key={app.id} app={app} />
      ))}
    </div>
  )
}
