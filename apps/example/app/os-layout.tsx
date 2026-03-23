'use client'

import { OSShell } from 'next-os'
import type { AppDefinition } from 'next-os'

function emojiIcon(emoji: string, bg: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><rect width="128" height="128" rx="28" fill="${bg}"/><text x="64" y="76" font-size="64" text-anchor="middle" dominant-baseline="central">${emoji}</text></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

const apps: AppDefinition[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: emojiIcon('📊', '#3b82f6'),
    route: '/dashboard',
    defaultSize: { w: 1000, h: 680 },
    instanceable: false,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: emojiIcon('📈', '#8b5cf6'),
    route: '/analytics',
    defaultSize: { w: 960, h: 640 },
    instanceable: false,
  },
  {
    id: 'mail',
    label: 'Mail',
    icon: emojiIcon('✉️', '#f43f5e'),
    route: '/mail',
    defaultSize: { w: 900, h: 600 },
    instanceable: false,
  },
  {
    id: 'calendar',
    label: 'Calendar',
    icon: emojiIcon('📅', '#f59e0b'),
    route: '/calendar',
    defaultSize: { w: 880, h: 640 },
    instanceable: false,
  },
  {
    id: 'files',
    label: 'Files',
    icon: emojiIcon('📁', '#10b981'),
    route: '/files',
    defaultSize: { w: 800, h: 560 },
    instanceable: false,
  },
  {
    id: 'notes',
    label: 'Notes',
    icon: emojiIcon('📝', '#06b6d4'),
    route: '/notes',
    defaultSize: { w: 640, h: 500 },
    instanceable: true,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: emojiIcon('⚙️', '#6b7280'),
    route: '/settings',
    defaultSize: { w: 720, h: 520 },
    resizable: false,
    instanceable: false,
  },
]

export function OSLayout({ children }: { children: React.ReactNode }) {
  return (
    <OSShell
      apps={apps}
      theme="macos"
      wallpaper="linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)"
      taskbarVariant="dock"
      initialWindows={['dashboard']}
    >
      {children}
    </OSShell>
  )
}
