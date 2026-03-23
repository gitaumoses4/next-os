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
  contentBg: string
  loadingSpinnerColor: string
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
  border: string
  magnification: boolean
  runningIndicatorColor: string
  hoverBg: string
  tooltipBg: string
  tooltipColor: string
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
  defaultWallpaper: string
}

export interface CommandPaletteTheme {
  bg: string
  blur: string
  border: string
  shadow: string
  inputColor: string
  inputPlaceholderColor: string
  itemHoverBg: string
  itemColor: string
  itemBadgeColor: string
  separatorColor: string
  hintColor: string
  overlayBg: string
  borderRadius: string
}

export interface ModeToggleTheme {
  bg: string
  blur: string
  border: string
  color: string
  hoverPadding: string
  borderRadius: string
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
  commandPalette: CommandPaletteTheme
  modeToggle: ModeToggleTheme
  animation: AnimationTheme
  tokens: Record<string, string>
}
