import type { OSTheme } from '@/themes/types'

export function themeToVars(theme: OSTheme): Record<string, string> {
  const vars: Record<string, string> = {}

  // Window chrome
  vars['--nos-window-radius'] = theme.windowChrome.borderRadius
  vars['--nos-titlebar-height'] = `${theme.windowChrome.titlebarHeight}px`
  vars['--nos-titlebar-bg'] = theme.windowChrome.titlebarBg
  vars['--nos-titlebar-bg-unfocused'] = theme.windowChrome.titlebarBgUnfocused
  vars['--nos-titlebar-text-color'] = theme.windowChrome.titlebarTextColor
  vars['--nos-window-shadow'] = theme.windowChrome.shadow
  vars['--nos-window-shadow-focused'] = theme.windowChrome.shadowFocused
  vars['--nos-window-border'] = theme.windowChrome.border
  vars['--nos-window-glass-bg'] = theme.windowChrome.glassBg
  vars['--nos-window-glass-blur'] = theme.windowChrome.glassBlur

  // Dock
  vars['--nos-dock-height'] = `${theme.dock.height}px`
  vars['--nos-dock-item-size'] = `${theme.dock.itemSize}px`
  vars['--nos-dock-gap'] = `${theme.dock.gap}px`
  vars['--nos-dock-bg'] = theme.dock.bg
  vars['--nos-dock-blur'] = theme.dock.blur
  vars['--nos-dock-radius'] = theme.dock.borderRadius
  vars['--nos-dock-padding'] = theme.dock.padding
  vars['--nos-dock-indicator-color'] = theme.dock.runningIndicatorColor

  // Taskbar
  vars['--nos-taskbar-height'] = `${theme.taskbar.height}px`
  vars['--nos-taskbar-bg'] = theme.taskbar.bg
  vars['--nos-taskbar-blur'] = theme.taskbar.blur
  vars['--nos-taskbar-item-active-bg'] = theme.taskbar.itemActiveBg
  vars['--nos-taskbar-text-color'] = theme.taskbar.textColor

  // Desktop
  vars['--nos-desktop-icon-size'] = `${theme.desktop.iconSize}px`
  vars['--nos-desktop-icon-label-color'] = theme.desktop.iconLabelColor
  vars['--nos-desktop-icon-label-shadow'] = theme.desktop.iconLabelShadow
  vars['--nos-desktop-icon-selected-bg'] = theme.desktop.iconSelectedBg
  vars['--nos-desktop-grid-gap'] = `${theme.desktop.gridGap}px`
  vars['--nos-desktop-grid-padding'] = theme.desktop.gridPadding

  // Custom tokens
  for (const [key, value] of Object.entries(theme.tokens)) {
    vars[`--nos-${key}`] = value
  }

  return vars
}
