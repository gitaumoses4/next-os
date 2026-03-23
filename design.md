# next-os — Design Document

> **next-os** — An npm package that wraps any Next.js app in a fully interactive desktop OS shell. Drop it in, configure your apps, and your web product gets window chrome, a dock, multi-window management, and a themeable desktop — with zero changes to your existing pages.

---

## 1. Project Overview

### What It Is

An npm package (`next-os`) that consumers install into an existing Next.js project. It wraps the app in a desktop OS shell — windows, dock/taskbar, desktop icons, wallpaper — without touching the underlying pages. Each "app" in the OS maps to a Next.js route, rendered inside a window via iframe.

### What It Is Not

- Not a full OS simulation (no file system, no terminal, no fake browser)
- Not a UI component library
- Not tied to any one OS aesthetic — fully themeable

### Inspiration

PostHog's OS mode: the product itself is unchanged, but the shell makes it feel like a native app running on a desktop.

---

## 2. Name & Package Identity

| Field     | Value                               |
| --------- | ----------------------------------- |
| Package   | `next-os`                           |
| Tagline   | _Give your Next.js app a desktop._  |
| npm scope | `next-os` (unprefixed, own package) |
| Peer deps | `next >= 13`, `react >= 18`         |
| License   | MIT                                 |

---

## 3. Repository Structure

```
next-os/
├── packages/
│   └── next-os/                     # The npm package
│       ├── src/
│       │   ├── components/
│       │   │   ├── Desktop/
│       │   │   │   ├── Desktop.tsx          # Root canvas: wallpaper + icon grid
│       │   │   │   ├── DesktopIcon.tsx      # Individual app icon on desktop
│       │   │   │   └── index.ts
│       │   │   ├── Window/
│       │   │   │   ├── Window.tsx           # Window shell (chrome, shadow, focus ring)
│       │   │   │   ├── WindowTitlebar.tsx   # Title, controls (close/min/max)
│       │   │   │   ├── WindowControls.tsx   # Traffic lights / squares / custom
│       │   │   │   ├── WindowContent.tsx    # iframe renderer
│       │   │   │   ├── WindowResizeHandles.tsx
│       │   │   │   └── index.ts
│       │   │   ├── Dock/
│       │   │   │   ├── Dock.tsx             # macOS-style dock
│       │   │   │   ├── DockItem.tsx         # Icon + running indicator + tooltip
│       │   │   │   └── index.ts
│       │   │   ├── Taskbar/
│       │   │   │   ├── Taskbar.tsx          # Windows-style taskbar
│       │   │   │   ├── TaskbarItem.tsx      # Window button in taskbar
│       │   │   │   ├── TaskbarClock.tsx
│       │   │   │   └── index.ts
│       │   │   └── OSShell/
│       │   │       ├── OSShell.tsx          # Root wrapper — entry point for consumers
│       │   │       └── index.ts
│       │   ├── context/
│       │   │   ├── OSContext.tsx            # Window state, focus, z-index
│       │   │   └── OSProvider.tsx           # Provider + initializer
│       │   ├── hooks/
│       │   │   ├── useWindow.ts             # open/close/minimize/maximize
│       │   │   ├── useWindowDrag.ts         # Pointer-based drag
│       │   │   ├── useWindowResize.ts       # 8-handle resize
│       │   │   ├── useFocus.ts              # z-index stack management
│       │   │   └── useTheme.ts              # Resolved theme tokens
│       │   ├── store/
│       │   │   └── windowStore.ts           # Zustand store
│       │   ├── themes/
│       │   │   ├── macos.ts
│       │   │   ├── windows11.ts
│       │   │   ├── ubuntu.ts
│       │   │   └── types.ts                 # OSTheme interface
│       │   ├── utils/
│       │   │   ├── mergeTheme.ts            # Deep merge partial themes
│       │   │   ├── snapGrid.ts              # Window snap zones
│       │   │   └── zIndexStack.ts
│       │   └── index.ts                     # Public exports
│       ├── package.json
│       ├── tsconfig.json
│       └── README.md
├── apps/
│   └── example/                     # Example Next.js app using next-os
│       ├── app/
│       │   ├── layout.tsx
│       │   ├── page.tsx
│       │   ├── dashboard/page.tsx
│       │   ├── settings/page.tsx
│       │   └── notes/page.tsx
│       └── package.json
├── package.json                     # Monorepo root (pnpm workspaces)
├── pnpm-workspace.yaml
└── turbo.json
```

---

## 4. Consumer API

### Installation

```bash
npm install next-os
```

### Usage in `app/layout.tsx`

```tsx
import { OSShell } from 'next-os'
import type { AppDefinition } from 'next-os'

const apps: AppDefinition[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: '/icons/dashboard.png',
    route: '/dashboard',
    defaultSize: { w: 1000, h: 680 },
    defaultPosition: { x: 80, y: 60 },
    resizable: true,
    instanceable: false, // only one instance at a time
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: '/icons/settings.png',
    route: '/settings',
    defaultSize: { w: 720, h: 520 },
    resizable: false,
  },
  {
    id: 'notes',
    label: 'Notes',
    icon: '/icons/notes.png',
    route: '/notes',
    defaultSize: { w: 600, h: 500 },
    instanceable: true, // multiple notes windows allowed
  },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <OSShell
          apps={apps}
          theme="macos" // "macos" | "windows11" | "ubuntu" | OSTheme
          wallpaper="/wallpaper.jpg"
          taskbarVariant="dock" // "dock" | "taskbar"
          onWindowOpen={(appId) => console.log('opened', appId)}
          onWindowClose={(windowId) => console.log('closed', windowId)}
        >
          {children}
        </OSShell>
      </body>
    </html>
  )
}
```

### `OSShell` Props

```ts
interface OSShellProps {
  apps: AppDefinition[]
  theme?: 'macos' | 'windows11' | 'ubuntu' | OSTheme | DeepPartial<OSTheme>
  wallpaper?: string // URL or CSS gradient string
  taskbarVariant?: 'dock' | 'taskbar'
  initialWindows?: string[] // appIds to open on mount
  onWindowOpen?: (appId: string) => void
  onWindowClose?: (windowId: string) => void
  onWindowFocus?: (windowId: string) => void
  children: React.ReactNode // renders inside the active window, not behind the shell
}
```

### `AppDefinition`

```ts
interface AppDefinition {
  id: string
  label: string
  icon: string // URL to icon image
  route: string // Next.js route rendered inside window via iframe
  defaultSize: { w: number; h: number }
  defaultPosition?: { x: number; y: number } // default: centered
  minSize?: { w: number; h: number }
  maxSize?: { w: number; h: number }
  resizable?: boolean // default: true
  instanceable?: boolean // allow multiple windows; default: false
  titlebarTitle?: string // override label in titlebar
}
```

---

## 5. State Architecture

### Zustand Store (`windowStore.ts`)

```ts
// Window state shape
interface WindowState {
  id: string // unique window instance id (uuid)
  appId: string // links back to AppDefinition
  title: string
  position: { x: number; y: number }
  size: { w: number; h: number }
  status: 'open' | 'minimized' | 'maximized'
  zIndex: number
  isFocused: boolean
  isAnimating: boolean
}

// Store shape
interface OSStore {
  windows: Record<string, WindowState>
  zStack: string[] // ordered list of windowIds, last = top

  // Actions
  openWindow: (appId: string, apps: AppDefinition[]) => string // returns windowId
  closeWindow: (windowId: string) => void
  focusWindow: (windowId: string) => void
  minimizeWindow: (windowId: string) => void
  maximizeWindow: (windowId: string) => void
  restoreWindow: (windowId: string) => void
  moveWindow: (windowId: string, position: { x: number; y: number }) => void
  resizeWindow: (windowId: string, size: { w: number; h: number }) => void
}
```

### z-index Strategy

- `zStack` is an ordered array of `windowId`s. Index = relative z-order.
- Focusing a window splices it to the end of `zStack`.
- Each `WindowState.zIndex` is derived: `BASE_Z + zStack.indexOf(id)`.
- Base z-index: `100`. Desktop icons: `10`. Dock/Taskbar: `200`.
- When window closes, it's removed from `zStack`.

---

## 6. Component Specifications

### `OSShell`

- Renders `OSProvider` (context + store), then `Desktop`, `WindowManager`, and `Dock` or `Taskbar`.
- Applies theme CSS variables to a root `div` wrapping everything.
- `children` are not rendered directly — they are the Next.js page content that the user navigates to, which loads inside an iframe inside the active window.

### `Desktop`

- Full-viewport div with wallpaper (background-image or gradient).
- Renders a CSS grid of `DesktopIcon` components derived from `apps`.
- Double-clicking a `DesktopIcon` calls `openWindow(appId)`.
- Desktop click (not on icon) blurs all windows (no focused window).

### `DesktopIcon`

- Icon image + label below.
- Single-click: select state (highlight ring).
- Double-click: `openWindow`.
- Drag-to-reorder icons on desktop grid (v2 feature, skip in v1).

### `Window`

- Positioned absolutely within `WindowManager`.
- Structure:
  ```
  <div.window-root>           ← position, size, z-index, box-shadow, border-radius
    <WindowTitlebar />        ← drag handle, title, controls
    <WindowContent />         ← iframe pointing to app.route
    <WindowResizeHandles />   ← 8 transparent hit areas
  </div.window-root>
  ```
- `status === 'minimized'`: `display: none` + animate to dock position (framer-motion).
- `status === 'maximized'`: position `{x:0, y:0}`, size `{w: 100vw, h: 100vh - dockHeight}`.
- Focused window: theme-defined focus shadow or border.
- Click anywhere on window: `focusWindow(windowId)`.

### `WindowTitlebar`

- Height from theme: `theme.windowChrome.titlebarHeight`.
- Background: `theme.windowChrome.titlebarBg`.
- Title text centered (macOS) or left-aligned (Windows).
- Double-click titlebar: toggle maximize/restore.
- Contains `WindowControls`.

### `WindowControls`

- Controlled by `theme.windowChrome.controlStyle`:
  - `traffic-lights`: red/yellow/green circles (left side)
  - `squares`: min/max/close squares (right side, Windows style)
  - `custom`: consumer-provided render function via theme
- Close → `closeWindow`, Min → `minimizeWindow`, Max → `maximizeWindow` / `restoreWindow`.

### `WindowContent`

```tsx
<iframe
  src={app.route}
  style={{ width: '100%', height: '100%', border: 'none' }}
  sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
  loading="lazy"
/>
```

- `allow-same-origin` ensures session cookies pass through (auth works).
- On first render: show a brief skeleton/spinner before iframe `onLoad`.

### `WindowResizeHandles`

- 8 transparent `div`s positioned at corners and edges.
- Each has a specific `cursor` style (`se-resize`, `n-resize`, etc.).
- Pointer down on handle → starts resize via `useWindowResize`.

### `Dock`

- Fixed bottom (or top), centered horizontally.
- Background: frosted glass (`backdrop-filter: blur`) or solid, per theme.
- Renders one `DockItem` per app regardless of whether it's open.
- Running indicator: small dot under icon if any window with that `appId` is open.
- Click: if no window open → `openWindow`; if minimized → `restoreWindow`; if open → `focusWindow`; if focused → `minimizeWindow`.
- Bounce animation (framer-motion) when app opens.
- Magnification effect on hover (macOS theme only).

### `Taskbar`

- Fixed bottom, full width.
- Left: start button / logo.
- Center: list of open `TaskbarItem`s (one per open window).
- Right: clock (`TaskbarClock`), system tray placeholder.
- `TaskbarItem`: shows app icon + truncated title. Click focuses or minimizes.

---

## 7. Hooks

### `useWindowDrag(windowId)`

```ts
// Attaches to titlebar pointerdown
// On pointermove: calls moveWindow(windowId, newPosition)
// Clamps position to viewport bounds
// Returns: { dragProps } spread onto titlebar div
```

### `useWindowResize(windowId, handle)`

```ts
// handle: 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw'
// On pointermove: calculates new size + position based on handle direction
// Respects minSize / maxSize from AppDefinition
// Returns: { resizeProps } spread onto handle div
```

### `useWindow(appId?)`

```ts
// Returns helpers for use in consumer components:
const { openWindow, closeWindow, focusWindow } = useWindow()

// Or scoped to a specific window:
const { close, minimize, maximize, isOpen, isFocused } = useWindow('dashboard')
```

### `useFocus()`

```ts
// Returns: { focusedWindowId, focusedAppId }
```

---

## 8. Theme System

### `OSTheme` Interface

```ts
interface OSTheme {
  name: string

  windowChrome: {
    borderRadius: string // e.g. "10px"
    titlebarHeight: number // px
    titlebarBg: string // CSS color
    titlebarBgUnfocused: string
    titlebarTextColor: string
    controlStyle: 'traffic-lights' | 'squares' | 'custom'
    controlsPosition: 'left' | 'right'
    shadow: string // CSS box-shadow
    shadowFocused: string
    border: string // e.g. "1px solid rgba(255,255,255,0.2)"
    glassBg: string // e.g. "rgba(30,30,30,0.7)"
    glassBlur: string // e.g. "blur(20px)"
  }

  dock: {
    position: 'bottom' | 'top'
    height: number
    itemSize: number
    gap: number
    bg: string
    blur: string
    borderRadius: string
    padding: string
    magnification: boolean
    runningIndicatorColor: string
  }

  taskbar: {
    position: 'bottom' | 'top'
    height: number
    bg: string
    blur: string
    itemActiveBg: string
    textColor: string
  }

  desktop: {
    iconSize: number
    iconLabelColor: string
    iconLabelShadow: string
    iconSelectedBg: string
    gridGap: number
    gridPadding: string
  }

  animation: {
    windowOpen: object // framer-motion variants
    windowClose: object
    windowMinimize: object
    dockBounce: object
  }

  tokens: Record<string, string> // injected as CSS custom properties
}
```

### Built-in Themes

**`macos`**

- Traffic light controls, left-aligned
- Frosted glass titlebar, 10px border-radius
- Bottom dock with magnification
- System font: SF Pro / `-apple-system`
- Soft shadows, subtle borders

**`windows11`**

- Square controls (min/max/close), right-aligned
- Solid or acrylic titlebar, 8px border-radius
- Bottom taskbar, full width
- Segoe UI font stack
- Sharp drop shadows

**`ubuntu`**

- Traffic light controls, left-aligned
- Solid titlebar (#3d3d3d), 6px border-radius
- Top dock (left edge option), full width bottom taskbar
- Ubuntu font
- Flat shadows

### Theme Merging

```ts
// Consumer can override specific tokens:
<OSShell
  theme={{
    windowChrome: {
      borderRadius: '16px',
      titlebarBg: '#1a1a2e',
    }
  }}
/>
// Deep-merged with 'macos' defaults (macos is the base when no name given)
```

---

## 9. CSS Architecture

- All theme values are injected as CSS custom properties on the root shell `div`:
  ```css
  --nos-titlebar-height: 40px;
  --nos-window-radius: 10px;
  --nos-dock-height: 72px;
  /* etc. */
  ```
- No Tailwind dependency — pure CSS modules + CSS variables.
- Consumer's Tailwind/global styles are isolated inside iframes.
- Package ships compiled CSS + JS — consumers import from `next-os`.

---

## 10. iframe Auth & Routing

### Session Passthrough

- Same-origin iframes automatically share cookies. As long as the shell and the app are on the same domain, auth (NextAuth, Supabase, custom JWT cookies) works without any configuration.

### iframe URL Management

- When a window is opened, the iframe `src` is set to `app.route`.
- The iframe manages its own internal navigation (Next.js router inside it works normally).
- No attempt to sync the parent URL bar with the window's current route in v1.

### Loading State

```tsx
// WindowContent shows a skeleton while iframe loads
const [loaded, setLoaded] = useState(false)
return (
  <>
    {!loaded && <WindowSkeleton />}
    <iframe onLoad={() => setLoaded(true)} ... />
  </>
)
```

---

## 11. Animations

All animations via **framer-motion**.

| Event           | Animation                                                  |
| --------------- | ---------------------------------------------------------- |
| Window open     | Scale from 0.95 + fade in (120ms ease-out)                 |
| Window close    | Scale to 0.95 + fade out (100ms ease-in)                   |
| Window minimize | Translate + scale toward dock icon position (200ms)        |
| Window restore  | Reverse of minimize                                        |
| Window maximize | Animate position/size to full viewport (150ms ease-in-out) |
| Dock bounce     | Y keyframe bounce on open (3 bounces, 400ms)               |
| Dock magnify    | Scale transform on hover (spring)                          |

---

## 12. Dependencies

```json
{
  "dependencies": {
    "framer-motion": "^11.0.0",
    "zustand": "^4.5.0",
    "uuid": "^9.0.0"
  },
  "peerDependencies": {
    "next": ">=13.0.0",
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "tsup": "^8.0.0"
  }
}
```

**No Tailwind required.** No `@use-gesture/react` — drag/resize implemented with native Pointer Events for minimum dependency footprint.

---

## 13. Build & Publish

```json
// tsup config (tsup.config.ts)
{
  "entry": ["src/index.ts"],
  "format": ["esm", "cjs"],
  "dts": true,
  "sourcemap": true,
  "clean": true,
  "external": ["react", "react-dom", "next"]
}
```

```json
// package.json exports
{
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  }
}
```

---

## 14. v1 Milestone Plan

### M1 — Scaffold & Shell (Week 1)

- [ ] Monorepo setup with pnpm workspaces + Turborepo
- [ ] `next-os` package: tsup build pipeline, TypeScript config
- [ ] `OSProvider` + Zustand store with all actions
- [ ] `OSShell` component renders Desktop + placeholder Dock
- [ ] CSS variable injection from theme

### M2 — Window Chrome (Week 2)

- [ ] `Window` component with titlebar, content area, resize handles
- [ ] `WindowControls`: traffic-lights and squares variants
- [ ] Drag via Pointer Events (`useWindowDrag`)
- [ ] Resize via 8 handles (`useWindowResize`)
- [ ] Focus & z-index stack management
- [ ] framer-motion: open/close animations

### M3 — Desktop & Icons (Week 2–3)

- [ ] `Desktop`: wallpaper, icon grid layout
- [ ] `DesktopIcon`: select on click, open on double-click
- [ ] Window renders iframe with `app.route`
- [ ] Loading skeleton in `WindowContent`
- [ ] Maximize / restore toggle

### M4 — Dock & Taskbar (Week 3)

- [ ] `Dock` with running indicators
- [ ] Dock click behaviour (open / focus / minimize / restore)
- [ ] Bounce animation on window open
- [ ] Magnification hover effect (macOS theme)
- [ ] `Taskbar` + `TaskbarItem` + `TaskbarClock`

### M5 — Themes & DX (Week 4)

- [ ] `macos`, `windows11`, `ubuntu` built-in themes
- [ ] `mergeTheme` util — deep partial merge
- [ ] `useWindow` public hook
- [ ] Example app in `/apps/example` with 3 routes
- [ ] README with usage, API reference, screenshots
- [ ] Publish to npm

---

## 15. Future Roadmap (Post-v1)

- **Snap zones** — snap windows to left/right half, corners
- **Spotlight / command palette** — fuzzy search over apps + open windows
- **Desktop icon drag-to-reorder**
- **Multiple desktops / virtual spaces**
- **Context menus** — right-click on desktop, window titlebar
- **`next-os.config.ts`** — zero-prop config file at project root
- **Storybook** — isolated component development
- **`next-os-shell` alias package** — descriptive name redirect
- **React Native Web / Tauri** — extend shell to native desktop wrappers

---

## 16. Example App Structure

The `/apps/example` Next.js app demonstrates a SaaS product in OS mode:

```
apps/example/
├── app/
│   ├── layout.tsx          ← OSShell wraps everything here
│   ├── page.tsx            ← Not used (shell takes over viewport)
│   ├── dashboard/
│   │   └── page.tsx        ← Analytics dashboard UI
│   ├── settings/
│   │   └── page.tsx        ← Settings form
│   └── notes/
│       └── page.tsx        ← Simple notes editor
├── public/
│   ├── wallpaper.jpg
│   └── icons/
│       ├── dashboard.png
│       ├── settings.png
│       └── notes.png
└── package.json
```

---

## 17. Claude Code Bootstrap Instructions

When starting this project, execute in order:

1. **Init monorepo**

   ```bash
   mkdir next-os && cd next-os
   pnpm init
   mkdir -p packages/next-os apps/example
   ```

2. **Install monorepo tooling**

   ```bash
   pnpm add -Dw turbo
   ```

3. **Scaffold `packages/next-os`** — start with `OSContext`, `windowStore`, `OSShell`, `Window`, `Desktop`, `Dock`, `Taskbar` in that order.

4. **Wire `apps/example`** — install `next`, add the three demo routes, wrap in `OSShell` in `layout.tsx`.

5. **Build**

   ```bash
   pnpm --filter next-os build
   pnpm --filter example dev
   ```

6. **Verify**: Desktop renders, double-clicking an icon opens a window, window is draggable and resizable, dock shows running indicator.

---

_Document version: 1.0 — Ready for implementation._
