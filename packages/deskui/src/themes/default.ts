import type { OSTheme } from './types'

export const defaultTheme: OSTheme = {
  name: 'deskui',

  windowChrome: {
    borderRadius: '10px',
    titlebarHeight: 40,
    titlebarBg: 'rgba(236, 236, 236, 0.82)',
    titlebarBgUnfocused: 'rgba(246, 246, 246, 0.7)',
    titlebarTextColor: '#1d1d1f',
    controlStyle: 'traffic-lights',
    controlsPosition: 'left',
    shadow: '0 4px 20px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06)',
    shadowFocused: '0 10px 40px rgba(0, 0, 0, 0.18), 0 2px 6px rgba(0, 0, 0, 0.08)',
    border: '1px solid rgba(0, 0, 0, 0.08)',
    glassBg: 'rgba(255, 255, 255, 0.75)',
    glassBlur: 'blur(24px)',
    contentBg: '#ffffff',
    loadingSpinnerColor: '#c0c0c0',
    unfocusedFilter: 'saturate(0.9) brightness(0.98)',
  },

  dock: {
    position: 'bottom',
    height: 70,
    itemSize: 48,
    gap: 4,
    bg: 'rgba(255, 255, 255, 0.2)',
    blur: 'blur(24px)',
    borderRadius: '16px',
    padding: '4px 10px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    magnification: false,
    runningIndicatorColor: 'rgba(0, 0, 0, 0.4)',
    hoverBg: 'rgba(0, 0, 0, 0.06)',
    tooltipBg: 'rgba(0, 0, 0, 0.72)',
    tooltipColor: '#ffffff',
    badgeBg: '#ff3b30',
    badgeColor: '#ffffff',
    autoHide: true,
  },

  taskbar: {
    position: 'bottom',
    height: 40,
    bg: 'rgba(236, 236, 236, 0.85)',
    blur: 'blur(24px)',
    itemActiveBg: 'rgba(0, 0, 0, 0.06)',
    textColor: '#1d1d1f',
  },

  desktop: {
    iconSize: 64,
    iconLabelColor: '#ffffff',
    iconLabelShadow: '0 1px 3px rgba(0, 0, 0, 0.55)',
    iconSelectedBg: 'rgba(0, 122, 255, 0.25)',
    gridGap: 16,
    gridPadding: '24px',
    defaultWallpaper: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 70%, #533483 100%)',
    borderRadius: 8,
  },

  commandPalette: {
    bg: 'rgba(40, 40, 40, 0.88)',
    blur: 'blur(40px)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    shadow: '0 24px 80px rgba(0, 0, 0, 0.45)',
    inputColor: '#ffffff',
    inputPlaceholderColor: 'rgba(255, 255, 255, 0.4)',
    itemHoverBg: 'rgba(255, 255, 255, 0.08)',
    itemColor: '#ffffff',
    itemBadgeColor: 'rgba(255, 255, 255, 0.3)',
    separatorColor: 'rgba(255, 255, 255, 0.06)',
    hintColor: 'rgba(255, 255, 255, 0.25)',
    overlayBg: 'rgba(0, 0, 0, 0.25)',
    borderRadius: '12px',
  },

  contextMenu: {
    bg: 'rgba(40, 40, 40, 0.88)',
    blur: 'blur(40px)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    shadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
    borderRadius: '8px',
    itemColor: '#ffffff',
    itemHoverBg: 'rgba(0, 122, 255, 0.8)',
    itemHoverColor: '#ffffff',
    itemDisabledColor: 'rgba(255, 255, 255, 0.25)',
    separatorColor: 'rgba(255, 255, 255, 0.06)',
    shortcutColor: 'rgba(255, 255, 255, 0.35)',
    dangerColor: '#ff453a',
    dangerHoverBg: 'rgba(255, 69, 58, 0.2)',
  },

  notification: {
    bg: 'rgba(40, 40, 40, 0.88)',
    blur: 'blur(40px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    shadow: '0 8px 30px rgba(0, 0, 0, 0.25)',
    borderRadius: '14px',
    titleColor: '#ffffff',
    bodyColor: 'rgba(255, 255, 255, 0.65)',
    timeColor: 'rgba(255, 255, 255, 0.3)',
    actionColor: '#007aff',
    panelBg: 'rgba(30, 30, 30, 0.92)',
    panelWidth: 360,
  },

  menuBar: {
    height: 28,
    bg: 'rgba(236, 236, 236, 0.82)',
    blur: 'blur(24px)',
    textColor: '#1d1d1f',
    activeTextColor: '#ffffff',
    activeItemBg: 'rgba(0, 122, 255, 0.8)',
    border: '1px solid rgba(0, 0, 0, 0.06)',
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
    'accent-color': '#007aff',
  },
}
