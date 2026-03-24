'use client'

import { OSShell } from 'deskui'
import type { AppDefinition } from 'deskui'
import {
  HiOutlineChartBarSquare,
  HiOutlineChartPie,
  HiOutlineEnvelope,
  HiOutlineCalendarDays,
  HiOutlineFolder,
  HiOutlineDocumentText,
  HiOutlineCog6Tooth,
} from 'react-icons/hi2'

function Icon({ children, bg }: { children: React.ReactNode; bg: string }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '22%',
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
      }}
    >
      {children}
    </div>
  )
}

const apps: AppDefinition[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: (
      <Icon bg="#3b82f6">
        <HiOutlineChartBarSquare size="60%" />
      </Icon>
    ),
    route: '/dashboard',
    defaultSize: { w: 1000, h: 680 },
    instanceable: false,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: (
      <Icon bg="#8b5cf6">
        <HiOutlineChartPie size="60%" />
      </Icon>
    ),
    route: '/analytics',
    defaultSize: { w: 960, h: 640 },
    instanceable: false,
  },
  {
    id: 'mail',
    label: 'Mail',
    icon: (
      <Icon bg="#f43f5e">
        <HiOutlineEnvelope size="60%" />
      </Icon>
    ),
    route: '/mail',
    defaultSize: { w: 900, h: 600 },
    instanceable: false,
  },
  {
    id: 'calendar',
    label: 'Calendar',
    icon: (
      <Icon bg="#f59e0b">
        <HiOutlineCalendarDays size="60%" />
      </Icon>
    ),
    route: '/calendar',
    defaultSize: { w: 880, h: 640 },
    instanceable: false,
  },
  {
    id: 'files',
    label: 'Files',
    icon: (
      <Icon bg="#10b981">
        <HiOutlineFolder size="60%" />
      </Icon>
    ),
    route: '/files',
    defaultSize: { w: 800, h: 560 },
    instanceable: false,
  },
  {
    id: 'notes',
    label: 'Notes',
    icon: (
      <Icon bg="#06b6d4">
        <HiOutlineDocumentText size="60%" />
      </Icon>
    ),
    route: '/notes',
    defaultSize: { w: 640, h: 500 },
    instanceable: true,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: (
      <Icon bg="#6b7280">
        <HiOutlineCog6Tooth size="60%" />
      </Icon>
    ),
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
      wallpaper="linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)"
      taskbarVariant="dock"
      initialWindows={['dashboard']}
    >
      {children}
    </OSShell>
  )
}
