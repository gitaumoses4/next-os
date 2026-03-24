# deskui

A desktop OS shell for your web app. Drop it in and your product gets windows, a dock, a menu bar, and a full desktop experience — with zero changes to your existing pages.

![Desktop](docs/screenshots/desktop.png)

## Features

- **Window management** — drag, resize, minimize, maximize, snap to edges (halves, quarters, thirds)
- **Menu bar** — app name, File/Edit/View/Window menus with keyboard shortcuts
- **Dock** — app icons with running indicators, badges, tooltips, auto-hide
- **Taskbar** — Windows-style alternative with window grouping and system tray
- **Command palette** — Cmd/Ctrl+K to search apps, windows, and actions
- **Mission Control** — F3 to see all windows in an overview grid
- **Window switcher** — Cmd/Ctrl+Tab to cycle through open windows
- **Context menus** — right-click on desktop and window titlebars
- **Notifications** — toast notifications and a notification panel
- **Lock screen** — idle timeout or Cmd/Ctrl+L with blurred wallpaper and clock
- **Themes** — light and dark themes, fully customizable via tokens
- **Desktop/Web toggle** — switch between OS mode and normal web mode
- **Picture-in-picture** — pin windows as small always-on-top overlays
- **Tab grouping** — merge windows into tabbed groups
- **Accessibility** — ARIA roles, keyboard navigation, focus trap, reduced motion, high contrast

![Window](docs/screenshots/window.png)

## Installation

```bash
npm install deskui
```

Peer dependencies: `react >= 18`, `react-dom >= 18`, `framer-motion >= 11`

## Quick Start

```tsx
import { OSShell } from 'deskui'
import type { AppDefinition } from 'deskui'

const apps: AppDefinition[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <DashboardIcon />, // React node, string URL, or { src, src2x }
    route: '/dashboard',
    defaultSize: { w: 1000, h: 680 },
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <SettingsIcon />,
    route: '/settings',
    defaultSize: { w: 720, h: 520 },
    resizable: false,
  },
  {
    id: 'notes',
    label: 'Notes',
    icon: <NotesIcon />,
    route: '/notes',
    defaultSize: { w: 600, h: 500 },
    instanceable: true, // allow multiple windows
  },
]

export default function Layout({ children }) {
  return (
    <OSShell
      apps={apps}
      wallpaper="/wallpaper.jpg"
      taskbarVariant="dock"
      initialWindows={['dashboard']}
    >
      {children}
    </OSShell>
  )
}
```

Each app's `route` is rendered inside an iframe within its window. Your existing pages work unchanged — auth, routing, and styles are isolated.

## OSShell Props

| Prop             | Type                                 | Default             | Description                                       |
| ---------------- | ------------------------------------ | ------------------- | ------------------------------------------------- |
| `apps`           | `AppDefinition[]`                    | **required**        | Apps available in the desktop                     |
| `theme`          | `OSTheme \| DeepPartial<OSTheme>`    | `defaultTheme`      | Full theme or partial override                    |
| `wallpaper`      | `string \| string[] \| () => string` | gradient            | URL, CSS gradient, array (slideshow), or function |
| `taskbarVariant` | `'dock' \| 'taskbar'`                | `'dock'`            | macOS dock or Windows taskbar                     |
| `dockItems`      | `DockEntry[]`                        | derived from `apps` | Custom dock items with separators                 |
| `initialWindows` | `string[]`                           | `[]`                | App IDs to open on mount                          |
| `defaultMode`    | `'desktop' \| 'web'`                 | `'desktop'`         | Initial mode                                      |
| `persistLayout`  | `boolean`                            | `false`             | Save/restore window positions via localStorage    |
| `lockScreen`     | `boolean \| { idleTimeout: number }` | `false`             | Enable lock screen                                |
| `onWindowOpen`   | `(appId: string) => void`            | —                   | Called when a window opens                        |
| `onWindowClose`  | `(windowId: string) => void`         | —                   | Called when a window closes                       |
| `onWindowFocus`  | `(windowId: string) => void`         | —                   | Called when a window gains focus                  |
| `onModeChange`   | `(mode: 'desktop' \| 'web') => void` | —                   | Called when desktop/web mode changes              |

## AppDefinition

```ts
interface AppDefinition {
  id: string
  label: string
  icon: React.ReactNode // React component, string URL, or { src, src2x }
  route: string // rendered inside iframe
  defaultSize: { w: number; h: number }
  defaultPosition?: { x: number; y: number }
  minSize?: { w: number; h: number }
  maxSize?: { w: number; h: number }
  resizable?: boolean // default: true
  instanceable?: boolean // allow multiple windows; default: false
  titlebarTitle?: string // override label in titlebar
  skeleton?: React.ReactNode // custom loading skeleton
  beforeClose?: () => boolean | Promise<boolean> // guard before closing
  renderTitlebar?: (props: TitlebarRenderProps) => React.ReactNode
  renderControls?: (props: ControlsRenderProps) => React.ReactNode
}
```

## Themes

deskui ships with two built-in themes:

```tsx
import { defaultTheme, defaultDarkTheme } from 'deskui'

// Light theme (default)
<OSShell theme={defaultTheme} />

// Dark theme
<OSShell theme={defaultDarkTheme} />

// Partial override
<OSShell theme={{ windowChrome: { borderRadius: '0px' } }} />
```

The theme controls every visual aspect — window chrome, dock, taskbar, menu bar, context menus, notifications, command palette, and more. All values are injected as `--nos-*` CSS custom properties.

The `colorScheme` field (`'light' | 'dark'`) is passed to iframe content via URL parameter and postMessage, so your app pages can render in the matching mode.

## Keyboard Shortcuts

| Shortcut               | Action                      |
| ---------------------- | --------------------------- |
| `Cmd/Ctrl+K`           | Command palette             |
| `Cmd/Ctrl+W`           | Close focused window        |
| `Cmd/Ctrl+M`           | Minimize focused window     |
| `Cmd/Ctrl+Shift+F`     | Maximize/restore            |
| `Cmd/Ctrl+Tab`         | Window switcher             |
| `Cmd/Ctrl+`` ` ``      | Cycle windows of same app   |
| `Cmd/Ctrl+D`           | Show desktop (minimize all) |
| `Cmd/Ctrl+Shift+D`     | Toggle desktop/web mode     |
| `Cmd/Ctrl+L`           | Lock screen                 |
| `Cmd/Ctrl+Arrow`       | Snap to half/maximize       |
| `Cmd/Ctrl+Shift+Arrow` | Snap to thirds              |
| `F3`                   | Mission Control             |

![Command Palette](docs/screenshots/command-palette.png)

## Hooks

### useWindow

```tsx
// Unscoped
const { openWindow, closeWindow, focusWindow } = useWindow()

// Scoped to an app
const { open, close, minimize, maximize, isOpen, isFocused } = useWindow('dashboard')
```

### useDesktop

```tsx
const {
  showDesktop,
  toggleMissionControl,
  cascadeWindows,
  tileWindows,
  closeAll,
  openApp,
  getOpenWindows,
  getFocusedWindow,
} = useDesktop()
```

### useNotification

```tsx
const { notify, dismiss, clearAll, unreadCount } = useNotification()

notify({
  title: 'New message',
  body: 'You have 3 unread messages',
  icon: <MailIcon />,
  action: { label: 'View', onClick: () => openApp('mail') },
})
```

### useWindowEvents

```tsx
useWindowEvents({
  onOpen: (windowId, appId) => analytics.track('window_open', { appId }),
  onClose: (windowId) => console.log('closed', windowId),
  onFocus: (windowId) => console.log('focused', windowId),
  onMove: (windowId, position) => {},
  onResize: (windowId, size) => {},
  onMaximize: (windowId) => {},
  onMinimize: (windowId) => {},
})
```

### useDeskuiBridge

For use inside iframe content to communicate with the shell:

```tsx
const { colorScheme, setTitle, close, minimize, maximize, setBadge } = useDeskuiBridge()

// Change window title dynamically
setTitle('New Document - Notes')

// Set dock badge
setBadge(3)

// Read the shell's color scheme
console.log(colorScheme) // 'light' or 'dark'
```

### useOSEvents

Subscribe to all desktop events (works outside React too via `deskuiEvents`):

```tsx
useOSEvents((event) => {
  console.log(event.type, event) // 'window:open', 'window:close', 'lock', etc.
})

// Or without React:
import { deskuiEvents } from 'deskui'
deskuiEvents.on((event) => sendToAnalytics(event))
```

## Middleware

Intercept store actions to add business logic:

```tsx
import { useMiddleware } from 'deskui'

// Limit max windows
useMiddleware((action, next) => {
  if (action.type === 'openWindow') {
    const count = Object.keys(useOSStore.getState().windows).length
    if (count >= 5) return // block — don't call next()
  }
  next()
})

// Or without React:
import { deskuiMiddleware } from 'deskui'
deskuiMiddleware.use((action, next) => {
  console.log('Action:', action.type)
  next()
})
```

## Dock Separators

Group apps visually with dividers:

```tsx
import type { DockEntry } from 'deskui'

const dockItems: DockEntry[] = [
  apps[0], apps[1], apps[2],
  { type: 'separator' },
  apps[3], apps[4],
  { type: 'separator' },
  apps[5],
]

<OSShell apps={apps} dockItems={dockItems} />
```

## Custom Window Chrome

Replace the titlebar or controls with your own:

```tsx
const app: AppDefinition = {
  id: 'custom',
  label: 'Custom',
  icon: <Icon />,
  route: '/custom',
  defaultSize: { w: 800, h: 600 },
  renderTitlebar: ({ title, dragProps, onClose, onMinimize, onMaximize }) => (
    <div
      {...dragProps}
      style={{
        height: 40,
        background: '#1a1a1a',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
      }}
    >
      <span>{title}</span>
      <button onClick={onClose}>Close</button>
    </div>
  ),
}
```

## Lock Screen

```tsx
// Manual lock with Cmd/Ctrl+L
<OSShell lockScreen />

// Auto-lock after 5 minutes of inactivity
<OSShell lockScreen={{ idleTimeout: 300000 }} />
```

## Dynamic Wallpapers

```tsx
// Static
<OSShell wallpaper="/wallpaper.jpg" />

// CSS gradient
<OSShell wallpaper="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" />

// Slideshow (rotates every 30s)
<OSShell wallpaper={['/wp1.jpg', '/wp2.jpg', '/wp3.jpg']} />

// Dynamic (e.g., time of day)
<OSShell wallpaper={() => new Date().getHours() > 18 ? '/night.jpg' : '/day.jpg'} />
```

![Mission Control](docs/screenshots/mission-control.png)

## Architecture

- **Zustand store** — all window state (position, size, focus, z-index) in a single store
- **Iframe isolation** — each app route rendered in an iframe, styles don't leak
- **CSS variables** — all theme tokens injected as `--nos-*` custom properties
- **Pointer Events** — native drag/resize with no external libraries
- **framer-motion** — window open/close/maximize animations
- **postMessage bridge** — iframe-to-shell communication

## Browser Support

- Chrome/Edge 80+
- Firefox 80+
- Safari 14+
- `backdrop-filter` fallback for older browsers via `useGlassStyle`

## License

MIT
