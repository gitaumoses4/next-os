// Components
export { OSShell } from './components/OSShell'
export type { OSShellProps } from './components/OSShell'
export { Window } from './components/Window'
export { WindowManager } from './components/WindowManager'
export { Desktop } from './components/Desktop'
export { Dock } from './components/Dock'
export { Taskbar } from './components/Taskbar'
export { CommandPalette } from './components/CommandPalette'
export { ContextMenu } from './components/ContextMenu'
export type { ContextMenuItem } from './components/ContextMenu'
export type { SnapZone } from './store/windowStore'

// Hooks
export { useWindow } from './hooks/useWindow'
export { useFocus } from './hooks/useFocus'
export { useTheme } from './hooks/useTheme'
export { useWindowDrag } from './hooks/useWindowDrag'
export { useWindowResize } from './hooks/useWindowResize'
export { useDeskuiBridge } from './hooks/useDeskuiBridge'
export { useNotification } from './hooks/useNotification'
export { useDesktop } from './hooks/useDesktop'
export { useWindowEvents } from './hooks/useWindowEvents'
export { useOSEvents } from './hooks/useOSEvents'
export { useGlassStyle } from './hooks/useGlassStyle'
export { useMiddleware } from './hooks/useMiddleware'

// Context
export { useOSContext } from './context/OSContext'

// Store
export { useOSStore } from './store/windowStore'
export type { WindowState, OSStore } from './store/windowStore'

// Types
export type {
  AppDefinition,
  DeepPartial,
  TitlebarRenderProps,
  ControlsRenderProps,
  DockSeparator,
  DockEntry,
} from './types'
export type { OSTheme } from './themes/types'

// Themes
export { defaultTheme } from './themes/default'
export { defaultDarkTheme } from './themes/default-dark'

// Utilities
export { mergeTheme } from './utils/mergeTheme'
export { deskuiEvents } from './utils/eventEmitter'
export type { DeskuiEvent } from './utils/eventEmitter'
export { deskuiMiddleware } from './utils/middleware'
export type { MiddlewareAction, MiddlewareFn } from './utils/middleware'
