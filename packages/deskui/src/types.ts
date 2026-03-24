export interface AppDefinition {
  id: string
  label: string
  icon: React.ReactNode
  route: string
  defaultSize: { w: number; h: number }
  defaultPosition?: { x: number; y: number }
  minSize?: { w: number; h: number }
  maxSize?: { w: number; h: number }
  resizable?: boolean
  instanceable?: boolean
  titlebarTitle?: string
  skeleton?: React.ReactNode
  beforeClose?: () => boolean | Promise<boolean>
  renderTitlebar?: (props: TitlebarRenderProps) => React.ReactNode
  renderControls?: (props: ControlsRenderProps) => React.ReactNode
}

export interface TitlebarRenderProps {
  windowId: string
  title: string
  isFocused: boolean
  isMaximized: boolean
  onClose: () => void
  onMinimize: () => void
  onMaximize: () => void
  onRestore: () => void
  dragProps: Record<string, unknown>
}

export interface ControlsRenderProps {
  windowId: string
  isFocused: boolean
  isMaximized: boolean
  onClose: () => void
  onMinimize: () => void
  onMaximize: () => void
  onRestore: () => void
}

export interface DockSeparator {
  type: 'separator'
}

export type DockEntry = AppDefinition | DockSeparator

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}
