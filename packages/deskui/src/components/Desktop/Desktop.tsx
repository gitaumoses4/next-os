'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useOSContext } from '@/context/OSContext'
import { useOSStore } from '@/store/windowStore'
import { DesktopIcon } from './DesktopIcon'
import { ContextMenu } from '@/components/ContextMenu'
import type { ContextMenuItem } from '@/components/ContextMenu'

const SLIDESHOW_INTERVAL = 30_000

function resolveWallpaper(
  wallpaper: string | string[] | (() => string) | undefined,
  index: number,
): string | undefined {
  if (!wallpaper) return undefined
  if (typeof wallpaper === 'function') return wallpaper()
  if (Array.isArray(wallpaper)) return wallpaper[index % wallpaper.length]
  return wallpaper
}

function wallpaperToStyle(wp: string | undefined, fallback: string): React.CSSProperties {
  if (!wp) return { background: fallback }
  if (wp.startsWith('http') || wp.startsWith('/')) {
    return { backgroundImage: `url(${wp})`, backgroundSize: 'cover', backgroundPosition: 'center' }
  }
  return { background: wp }
}

export function Desktop() {
  const { apps, theme, wallpaper, taskbarVariant } = useOSContext()
  const blurAll = useOSStore((s) => s.blurAll)
  const showDesktop = useOSStore((s) => s.showDesktop)
  const openWindow = useOSStore((s) => s.openWindow)
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null)
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number } | null>(null)
  const [wpIndex, setWpIndex] = useState(0)
  const [fading, setFading] = useState(false)
  const prevWpRef = useRef<string | undefined>(undefined)
  const { gridGap, gridPadding } = theme.desktop

  // Slideshow rotation for array wallpapers
  useEffect(() => {
    if (!Array.isArray(wallpaper) || wallpaper.length <= 1) return
    const interval = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setWpIndex((i) => (i + 1) % wallpaper.length)
        setFading(false)
      }, 500)
    }, SLIDESHOW_INTERVAL)
    return () => clearInterval(interval)
  }, [wallpaper])

  const currentWp = resolveWallpaper(wallpaper, wpIndex)
  const wallpaperStyle = wallpaperToStyle(currentWp, theme.desktop.defaultWallpaper)

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
        transition: 'background 0.5s ease, background-image 0.5s ease',
        opacity: fading ? 0.8 : 1,
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
