// Components
export { OSShell } from './components/OSShell'
export type { OSShellProps } from './components/OSShell'

// Hooks
export { useWindow } from './hooks/useWindow'
export { useFocus } from './hooks/useFocus'
export { useTheme } from './hooks/useTheme'

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
