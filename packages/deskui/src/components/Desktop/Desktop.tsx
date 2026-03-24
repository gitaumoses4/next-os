'use client'

import { useState, useCallback } from 'react'
import { useOSContext } from '@/context/OSContext'
import { useOSStore } from '@/store/windowStore'
import { DesktopIcon } from './DesktopIcon'
import { ContextMenu } from '@/components/ContextMenu'
import type { ContextMenuItem } from '@/components/ContextMenu'

export function Desktop() {
  const { apps, theme, wallpaper, taskbarVariant } = useOSContext()
  const blurAll = useOSStore((s) => s.blurAll)
  const showDesktop = useOSStore((s) => s.showDesktop)
  const openWindow = useOSStore((s) => s.openWindow)
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null)
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number } | null>(null)
  const { gridGap, gridPadding } = theme.desktop

  const wallpaperStyle: React.CSSProperties = wallpaper
    ? wallpaper.startsWith('http') || wallpaper.startsWith('/')
      ? {
          backgroundImage: `url(${wallpaper})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }
      : { background: wallpaper }
    : { background: theme.desktop.defaultWallpaper }

  const onDesktopClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        setSelectedAppId(null)
        blurAll()
      }
    },
    [blurAll],
  )

  const onContextMenu = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      e.preventDefault()
      setContextMenuPos({ x: e.clientX, y: e.clientY })
    }
  }, [])

  const desktopMenuItems: ContextMenuItem[] = [
    ...apps.map((app) => ({
      label: `Open ${app.label}`,
      action: () => openWindow(app.id, apps),
    })),
    { separator: true, label: '' },
    {
      label: 'Show All Windows',
      action: () => showDesktop(),
    },
  ]

  return (
    <div
      onClick={onDesktopClick}
      onContextMenu={onContextMenu}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 10,
        padding: gridPadding,
        paddingTop:
          taskbarVariant === 'dock' ? theme.menuBar.height + parseInt(gridPadding) : gridPadding,
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

      <ContextMenu
        items={desktopMenuItems}
        position={contextMenuPos}
        onClose={() => setContextMenuPos(null)}
        theme={theme.contextMenu}
      />
    </div>
  )
}
