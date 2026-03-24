# deskui-react

A desktop OS shell for web apps — windows, dock, taskbar, and themes. Published as `deskui-react` on npm.

## Project structure

Monorepo managed with pnpm workspaces and Turborepo.

```
packages/deskui/     # The npm package (published as "deskui")
apps/example/        # Next.js example app demonstrating deskui
```

### deskui package layout

```
packages/deskui/src/
├── components/
│   ├── OSShell/       # Root wrapper, mode toggle (desktop/web)
│   ├── Window/        # Window, Titlebar, Controls, Content, ResizeHandles
│   ├── Desktop/       # Desktop canvas, DesktopIcon
│   ├── Dock/          # macOS-style dock with tooltip + glow hover
│   ├── Taskbar/       # Windows-style taskbar with clock
│   ├── WindowManager.tsx  # AnimatePresence wrapper for all windows
│   └── shared/        # AppIcon (renders string URLs or React nodes)
├── context/           # OSContext, OSProvider
├── hooks/             # useWindow, useFocus, useTheme, useWindowDrag, useWindowResize
├── store/             # Zustand window store (windowStore.ts)
├── themes/            # default.ts, types.ts
├── utils/             # mergeTheme, themeVars (CSS variable injection)
├── types.ts           # AppDefinition, DeepPartial
├── styles.css         # Keyframes and utility classes
└── index.ts           # Public exports barrel
```

## Commands

```bash
pnpm install              # Install all dependencies
pnpm run build            # Build all packages (Turborepo)
pnpm run dev              # Dev mode for all packages
pnpm run lint             # Lint all packages (tsc + eslint)
pnpm format               # Format all files with Prettier
pnpm format:check         # Check formatting without writing

# Package-specific
pnpm --filter deskui build    # Build the deskui package only
pnpm --filter deskui lint     # Type-check deskui
pnpm --filter example dev     # Run the example Next.js app
pnpm --filter example build   # Build the example app
```

## Build pipeline

- **deskui**: tsup (ESM + CJS + DTS), TypeScript strict mode
- **example**: Next.js 15 with `transpilePackages: ['deskui']` for workspace source resolution
- tsup externalizes `react`, `react-dom`, `next`, `framer-motion`, `zustand`, `uuid`

## Key architecture decisions

- **Iframe isolation**: Each app window renders its route in an iframe. OSShell detects when it's inside an iframe (`window.self !== window.top`) and skips the shell, rendering only children. This prevents recursive nesting.
- **Zustand store**: All window state (position, size, z-index, focus) lives in a single Zustand store. z-index is derived from a `zStack` array (BASE_Z 100 + index). Dock/taskbar at z-index 200.
- **CSS variables**: Theme tokens are injected as `--nos-*` CSS custom properties on the shell root div. No Tailwind dependency in the package itself.
- **Path aliases**: The deskui package uses `@/*` path aliases (mapped to `src/*` in tsconfig). tsup resolves these at build time.
- **`'use client'` directives**: Each component file has its own directive. The tsup bundle does NOT add a global banner — Next.js handles client/server boundaries via `transpilePackages`.
- **Mode toggle**: Users can switch between desktop mode and normal web mode via a button or Ctrl+Shift+D. Persisted in localStorage.
- **AppDefinition.icon**: Accepts `React.ReactNode` — either a string URL (rendered as `<img>`) or a React component. The shared `AppIcon` component handles both.

## Workflow

- Always use feature branches (`feat/...`) for new work
- PRs target `main`
- Prettier + lint-staged runs on pre-commit via Husky
- CI runs lint and build on push to main and on PRs
- Do not add Co-Authored-By or other Claude attribution to commits, PRs, or issues

## Coding conventions

- No semicolons, single quotes, trailing commas (Prettier config)
- 100 char print width
- Use `@/` imports within the deskui package (not relative `../..`)
- All theme values go through CSS variables — components read from the theme object, not hardcoded values
- Pointer Events for drag/resize (no external drag libraries)
- framer-motion for animations
- No Tailwind in the deskui package — pure inline styles + CSS variables

## Example app

The example app (`apps/example/`) uses:

- Next.js 15 + React 18
- HeroUI v2 + Tailwind CSS 3
- react-icons for app icons
- 7 demo routes: dashboard, analytics, mail, calendar, files, notes, settings

The Tailwind config resolves the HeroUI theme path via `require.resolve('@heroui/theme/package.json')` to work with pnpm's strict node_modules structure.
