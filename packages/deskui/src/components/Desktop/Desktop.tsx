'use client'

import { useState, useCallback } from 'react'
import { useOSContext } from '@/context/OSContext'
import { useOSStore } from '@/store/windowStore'
import { DesktopIcon } from './DesktopIcon'

export function Desktop() {
  const { apps, theme, wallpaper } = useOSContext()
  const blurAll = useOSStore((s) => s.blurAll)
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null)
  const { gridGap, gridPadding } = theme.desktop

  const wallpaperStyle: React.CSSProperties = wallpaper
    ? wallpaper.startsWith('http') || wallpaper.startsWith('/')
      ? {
          backgroundImage: `url(${wallpaper})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }
      : { background: wallpaper }
    : { background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }

  const onDesktopClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        setSelectedAppId(null)
        blurAll()
      }
    },
    [blurAll],
  )

  return (
    <div
      onClick={onDesktopClick}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 10,
        padding: gridPadding,
        ...wallpaperStyle,
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(auto-fill, ${theme.desktop.iconSize + 32}px)`,
          gridAutoFlow: 'column',
          gridTemplateRows: `repeat(auto-fill, ${theme.desktop.iconSize + 48}px)`,
          gap: gridGap,
          height: '100%',
        }}
      >
        {apps.map((app) => (
          <DesktopIcon
            key={app.id}
            app={app}
            isSelected={selectedAppId === app.id}
            onSelect={() => setSelectedAppId(app.id)}
          />
        ))}
      </div>
    </div>
  )
}
