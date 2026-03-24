import type { OSTheme } from './types'

export const defaultDarkTheme: OSTheme = {
  name: 'deskui-dark',
  colorScheme: 'dark',

  windowChrome: {
    borderRadius: '10px',
    titlebarHeight: 40,
    titlebarBg: 'rgba(40, 40, 40, 0.85)',
    titlebarBgUnfocused: 'rgba(50, 50, 50, 0.7)',
    titlebarTextColor: '#e5e5e7',
    controlStyle: 'traffic-lights',
    controlsPosition: 'left',
    shadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)',
    shadowFocused: '0 10px 40px rgba(0, 0, 0, 0.45), 0 2px 6px rgba(0, 0, 0, 0.25)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    glassBg: 'rgba(30, 30, 30, 0.78)',
    glassBlur: 'blur(24px)',
    contentBg: '#1c1c1e',
    loadingSpinnerColor: '#555',
    unfocusedFilter: 'saturate(0.85) brightness(0.92)',
  },

  dock: {
    position: 'bottom',
    height: 70,
    itemSize: 48,
    gap: 4,
    bg: 'rgba(30, 30, 30, 0.25)',
    blur: 'blur(24px)',
    borderRadius: '16px',
    padding: '4px 10px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    magnification: false,
    runningIndicatorColor: 'rgba(255, 255, 255, 0.5)',
    hoverBg: 'rgba(255, 255, 255, 0.08)',
    tooltipBg: 'rgba(0, 0, 0, 0.75)',
    tooltipColor: '#ffffff',
    badgeBg: '#ff453a',
    badgeColor: '#ffffff',
    autoHide: true,
  },

  taskbar: {
    position: 'bottom',
    height: 40,
    bg: 'rgba(30, 30, 30, 0.88)',
    blur: 'blur(24px)',
    itemActiveBg: 'rgba(255, 255, 255, 0.08)',
    textColor: '#e5e5e7',
  },

  desktop: {
    iconSize: 64,
    iconLabelColor: '#ffffff',
    iconLabelShadow: '0 1px 3px rgba(0, 0, 0, 0.6)',
    iconSelectedBg: 'rgba(0, 122, 255, 0.3)',
    gridGap: 16,
    gridPadding: '24px',
    defaultWallpaper: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 40%, #16213e 70%, #1a1a3e 100%)',
    borderRadius: 8,
  },

  commandPalette: {
    bg: 'rgba(40, 40, 40, 0.9)',
    blur: 'blur(40px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    shadow: '0 24px 80px rgba(0, 0, 0, 0.5)',
    inputColor: '#e5e5e7',
    inputPlaceholderColor: 'rgba(255, 255, 255, 0.35)',
    itemHoverBg: 'rgba(0, 122, 255, 0.8)',
    itemColor: '#e5e5e7',
    itemBadgeColor: 'rgba(255, 255, 255, 0.3)',
    separatorColor: 'rgba(255, 255, 255, 0.06)',
    hintColor: 'rgba(255, 255, 255, 0.25)',
    overlayBg: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '12px',
  },

  contextMenu: {
    bg: 'rgba(40, 40, 40, 0.9)',
    blur: 'blur(40px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    shadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
    borderRadius: '8px',
    itemColor: '#e5e5e7',
    itemHoverBg: 'rgba(0, 122, 255, 0.8)',
    itemHoverColor: '#ffffff',
    itemDisabledColor: 'rgba(255, 255, 255, 0.2)',
    separatorColor: 'rgba(255, 255, 255, 0.06)',
    shortcutColor: 'rgba(255, 255, 255, 0.3)',
    dangerColor: '#ff453a',
    dangerHoverBg: 'rgba(255, 69, 58, 0.2)',
  },

  notification: {
    bg: 'rgba(40, 40, 40, 0.9)',
    blur: 'blur(40px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    shadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
    borderRadius: '14px',
    titleColor: '#e5e5e7',
    bodyColor: 'rgba(255, 255, 255, 0.6)',
    timeColor: 'rgba(255, 255, 255, 0.25)',
    actionColor: '#0a84ff',
    panelBg: 'rgba(28, 28, 30, 0.95)',
    panelWidth: 360,
  },

  menuBar: {
    height: 28,
    bg: 'rgba(30, 30, 30, 0.85)',
    blur: 'blur(24px)',
    textColor: '#e5e5e7',
    activeTextColor: '#ffffff',
    activeItemBg: 'rgba(0, 122, 255, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
  },

  modeToggle: {
    bg: 'rgba(0, 0, 0, 0.55)',
    blur: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    color: '#ffffff',
    hoverPadding: '8px 14px',
    borderRadius: '20px',
  },

  animation: {
    windowOpen: {
      initial: { opacity: 0, scale: 0.95 },
      animate: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.12, ease: 'easeOut' },
      },
    },
    windowClose: {
      exit: {
        opacity: 0,
        scale: 0.95,
        transition: { duration: 0.1, ease: 'easeIn' },
      },
    },
    windowMinimize: {
      exit: { opacity: 0, scale: 0.5, y: 200, transition: { duration: 0.2 } },
    },
    dockBounce: {
      animate: {
        y: [0, -20, 0, -12, 0, -6, 0],
        transition: { duration: 0.4, ease: 'easeInOut' },
      },
    },
  },

  tokens: {
    'font-family':
      '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", system-ui, sans-serif',
    'accent-color': '#0a84ff',
  },
}
