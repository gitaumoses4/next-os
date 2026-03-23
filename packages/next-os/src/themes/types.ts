import type { Variants } from 'framer-motion'

export interface WindowChromeTheme {
  borderRadius: string
  titlebarHeight: number
  titlebarBg: string
  titlebarBgUnfocused: string
  titlebarTextColor: string
  controlStyle: 'traffic-lights' | 'squares' | 'custom'
  controlsPosition: 'left' | 'right'
  shadow: string
  shadowFocused: string
  border: string
  glassBg: string
  glassBlur: string
}

export interface DockTheme {
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

export interface TaskbarTheme {
  position: 'bottom' | 'top'
  height: number
  bg: string
  blur: string
  itemActiveBg: string
  textColor: string
}

export interface DesktopTheme {
  iconSize: number
  iconLabelColor: string
  iconLabelShadow: string
  iconSelectedBg: string
  gridGap: number
  gridPadding: string
}

export interface AnimationTheme {
  windowOpen: Variants
  windowClose: Variants
  windowMinimize: Variants
  dockBounce: Variants
}

export interface OSTheme {
  name: string
  windowChrome: WindowChromeTheme
  dock: DockTheme
  taskbar: TaskbarTheme
  desktop: DesktopTheme
  animation: AnimationTheme
  tokens: Record<string, string>
}
