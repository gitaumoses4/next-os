# deskui

A desktop OS shell for your web app. Drop it in and your product gets windows, a dock, a menu bar, and a full desktop experience — with zero changes to your existing pages.

![Desktop](https://raw.githubusercontent.com/gitaumoses4/deskui/main/packages/deskui/docs/screenshots/desktop.png)

## Installation

```bash
npm install deskui-react
```

Peer dependencies: `react >= 18`, `react-dom >= 18`, `framer-motion >= 11`

## Quick Start

```tsx
import { OSShell, useColorScheme } from 'deskui-react'
import type { AppDefinition } from 'deskui-react'

const apps: AppDefinition[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <DashboardIcon />,
    route: '/dashboard',
    defaultSize: { w: 1000, h: 680 },
  },
]

export default function Layout({ children }) {
  const { theme, toggle } = useColorScheme({ defaultScheme: 'system' })

  return (
    <OSShell apps={apps} theme={theme} taskbarVariant="dock" onToggleColorScheme={toggle}>
      {children}
    </OSShell>
  )
}
```

For full documentation, see the [GitHub README](https://github.com/gitaumoses4/deskui).

## License

MIT
