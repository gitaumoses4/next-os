'use client'

import { useState, useCallback, useEffect } from 'react'
import { useOSContext } from '@/context/OSContext'
import { useOSStore } from '@/store/windowStore'
import { ContextMenu } from '@/components/ContextMenu'
import type { ContextMenuItem } from '@/components/ContextMenu'

interface MenuBarProps {
  onToggleCommandPalette: () => void
}

export function MenuBar({ onToggleCommandPalette }: MenuBarProps) {
  const { theme, apps } = useOSContext()
  const windows = useOSStore((s) => s.windows)
  const closeWindow = useOSStore((s) => s.closeWindow)
  const minimizeWindow = useOSStore((s) => s.minimizeWindow)
  const maximizeWindow = useOSStore((s) => s.maximizeWindow)
  const restoreWindow = useOSStore((s) => s.restoreWindow)
  const toggleMissionControl = useOSStore((s) => s.toggleMissionControl)
  const showDesktop = useOSStore((s) => s.showDesktop)
  const mb = theme.menuBar

  const focusedWindow = Object.values(windows).find((w) => w.isFocused)
  const focusedApp = focusedWindow ? apps.find((a) => a.id === focusedWindow.appId) : null

  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null)
  const [menuItems, setMenuItems] = useState<ContextMenuItem[]>([])

  const [time, setTime] = useState('')
  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(
        now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }) +
          '  ' +
          now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      )
    }
    update()
    const interval = setInterval(update, 30_000)
    return () => clearInterval(interval)
  }, [])

  const openMenu = useCallback(
    (menuName: string, rect: DOMRect) => {
      setActiveMenu(menuName)
      setMenuPos({ x: rect.left, y: rect.bottom + 2 })

      const wid = focusedWindow?.id
      const isMax = focusedWindow?.status === 'maximized'

      const menus: Record<string, ContextMenuItem[]> = {
        app: [
          { label: `About ${focusedApp?.label ?? 'deskui'}` },
          { separator: true, label: '' },
          {
            label: 'Hide All Windows',
            shortcut: '⌘D',
            action: () => showDesktop(),
          },
          { separator: true, label: '' },
          ...(wid
            ? [
                {
                  label: `Close ${focusedApp?.label ?? 'Window'}`,
                  shortcut: '⌘W',
                  action: () => closeWindow(wid),
                },
              ]
            : []),
        ],
        file: [
          { label: 'New Window', disabled: true },
          { separator: true, label: '' },
          ...(wid
            ? [
                {
                  label: 'Close Window',
                  shortcut: '⌘W',
                  action: () => closeWindow(wid),
                },
              ]
            : []),
        ],
        edit: [
          { label: 'Undo', shortcut: '⌘Z', disabled: true },
          { label: 'Redo', shortcut: '⌘⇧Z', disabled: true },
          { separator: true, label: '' },
          { label: 'Cut', shortcut: '⌘X', disabled: true },
          { label: 'Copy', shortcut: '⌘C', disabled: true },
          { label: 'Paste', shortcut: '⌘V', disabled: true },
          { label: 'Select All', shortcut: '⌘A', disabled: true },
        ],
        view: [
          {
            label: 'Mission Control',
            shortcut: 'F3',
            action: () => toggleMissionControl(),
          },
          {
            label: 'Command Palette',
            shortcut: '⌘K',
            action: () => onToggleCommandPalette(),
          },
          { separator: true, label: '' },
          ...(wid
            ? [
                {
                  label: isMax ? 'Exit Full Screen' : 'Enter Full Screen',
                  shortcut: '⌘⇧F',
                  action: () => (isMax ? restoreWindow(wid) : maximizeWindow(wid)),
                },
                {
                  label: 'Minimize',
                  shortcut: '⌘M',
                  action: () => minimizeWindow(wid),
                },
              ]
            : []),
        ],
        window: [
          ...(wid
            ? [
                {
                  label: 'Minimize',
                  shortcut: '⌘M',
                  action: () => minimizeWindow(wid),
                },
                {
                  label: isMax ? 'Restore' : 'Maximize',
                  shortcut: '⌘⇧F',
                  action: () => (isMax ? restoreWindow(wid) : maximizeWindow(wid)),
                },
                { separator: true, label: '' },
              ]
            : []),
          {
            label: 'Show All Windows',
            shortcut: 'F3',
            action: () => toggleMissionControl(),
          },
          {
            label: 'Show Desktop',
            shortcut: '⌘D',
            action: () => showDesktop(),
          },
        ],
      }

      setMenuItems(menus[menuName] ?? [])
    },
    [
      focusedWindow,
      focusedApp,
      closeWindow,
      minimizeWindow,
      maximizeWindow,
      restoreWindow,
      toggleMissionControl,
      showDesktop,
      onToggleCommandPalette,
    ],
  )

  const closeMenu = useCallback(() => {
    setActiveMenu(null)
    setMenuPos(null)
  }, [])

  const menuButton = (label: string, menuName: string) => (
    <button
      key={menuName}
      onClick={(e) => {
        if (activeMenu === menuName) {
          closeMenu()
        } else {
          openMenu(menuName, e.currentTarget.getBoundingClientRect())
        }
      }}
      onMouseEnter={(e) => {
        if (activeMenu && activeMenu !== menuName) {
          openMenu(menuName, e.currentTarget.getBoundingClientRect())
        }
      }}
      style={{
        background: activeMenu === menuName ? mb.activeItemBg : 'transparent',
        color: activeMenu === menuName ? mb.activeTextColor : mb.textColor,
        border: 'none',
        padding: '2px 10px',
        borderRadius: 4,
        fontSize: 13,
        cursor: 'default',
        fontWeight: menuName === 'app' ? 600 : 400,
        fontFamily: 'inherit',
      }}
    >
      {label}
    </button>
  )

  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: mb.height,
          zIndex: 201,
          background: mb.bg,
          backdropFilter: mb.blur,
          WebkitBackdropFilter: mb.blur,
          borderBottom: mb.border,
          display: 'flex',
          alignItems: 'center',
          padding: '0 8px',
          gap: 2,
          fontFamily: 'inherit',
        }}
      >
        {/* App name (bold) */}
        {menuButton(focusedApp?.label ?? 'deskui', 'app')}
        {menuButton('File', 'file')}
        {menuButton('Edit', 'edit')}
        {menuButton('View', 'view')}
        {menuButton('Window', 'window')}

        {/* Right side: clock */}
        <div style={{ marginLeft: 'auto', fontSize: 13, color: mb.textColor }}>{time}</div>
      </div>

      <ContextMenu
        items={menuItems}
        position={menuPos}
        onClose={closeMenu}
        theme={theme.contextMenu}
      />
    </>
  )
}
