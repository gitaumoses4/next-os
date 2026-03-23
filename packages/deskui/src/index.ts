// Components
export { OSShell } from './components/OSShell'
export type { OSShellProps } from './components/OSShell'
export { Window } from './components/Window'
export { WindowManager } from './components/WindowManager'
export { Desktop } from './components/Desktop'
export { Dock } from './components/Dock'
export { Taskbar } from './components/Taskbar'

// Hooks
export { useWindow } from './hooks/useWindow'
export { useFocus } from './hooks/useFocus'
export { useTheme } from './hooks/useTheme'
export { useWindowDrag } from './hooks/useWindowDrag'
export { useWindowResize } from './hooks/useWindowResize'

// Context
export { useOSContext } from './context/OSContext'

// Store
export { useOSStore } from './store/windowStore'
export type { WindowState, OSStore } from './store/windowStore'

// Types
export type { AppDefinition, DeepPartial } from './types'
export type { OSTheme } from './themes/types'

// Themes
export { macosTheme } from './themes/macos'

// Utilities
export { mergeTheme } from './utils/mergeTheme'
