import type { OSTheme } from './types'

export const defaultTheme: OSTheme = {
  name: 'deskui',

  windowChrome: {
    borderRadius: '12px',
    titlebarHeight: 42,
    titlebarBg: 'rgba(255, 255, 255, 0.82)',
    titlebarBgUnfocused: 'rgba(255, 255, 255, 0.65)',
    titlebarTextColor: '#1c1c1e',
    controlStyle: 'traffic-lights',
    controlsPosition: 'left',
    shadow: '0 4px 24px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)',
    shadowFocused: '0 8px 40px rgba(0, 0, 0, 0.14), 0 1px 3px rgba(0, 0, 0, 0.08)',
    border: '1px solid rgba(0, 0, 0, 0.06)',
    glassBg: 'rgba(255, 255, 255, 0.72)',
    glassBlur: 'blur(24px)',
    contentBg: '#f8f8f8',
    loadingSpinnerColor: '#999',
  },

  dock: {
    position: 'bottom',
    height: 64,
    itemSize: 44,
    gap: 6,
    bg: 'rgba(255, 255, 255, 0.18)',
    blur: 'blur(24px)',
    borderRadius: '18px',
    padding: '6px 10px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    magnification: false,
    runningIndicatorColor: 'rgba(255, 255, 255, 0.7)',
    hoverBg: 'rgba(255, 255, 255, 0.15)',
    tooltipBg: 'rgba(0, 0, 0, 0.75)',
    tooltipColor: '#ffffff',
  },

  taskbar: {
    position: 'bottom',
    height: 44,
    bg: 'rgba(255, 255, 255, 0.12)',
    blur: 'blur(24px)',
    itemActiveBg: 'rgba(255, 255, 255, 0.12)',
    textColor: '#ffffff',
  },

  desktop: {
    iconSize: 56,
    iconLabelColor: '#ffffff',
    iconLabelShadow: '0 1px 4px rgba(0, 0, 0, 0.5)',
    iconSelectedBg: 'rgba(255, 255, 255, 0.15)',
    gridGap: 14,
    gridPadding: '24px',
    defaultWallpaper: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
  },

  commandPalette: {
    bg: 'rgba(30, 30, 30, 0.92)',
    blur: 'blur(24px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    shadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
    inputColor: '#ffffff',
    inputPlaceholderColor: 'rgba(255, 255, 255, 0.4)',
    itemHoverBg: 'rgba(255, 255, 255, 0.1)',
    itemColor: '#ffffff',
    itemBadgeColor: 'rgba(255, 255, 255, 0.3)',
    separatorColor: 'rgba(255, 255, 255, 0.08)',
    hintColor: 'rgba(255, 255, 255, 0.3)',
    overlayBg: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '14px',
  },

  modeToggle: {
    bg: 'rgba(0, 0, 0, 0.7)',
    blur: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    color: '#ffffff',
    hoverPadding: '8px 14px',
    borderRadius: '20px',
  },

  animation: {
    windowOpen: {
      initial: { opacity: 0, scale: 0.92, y: 12 },
      animate: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: 0.2, ease: [0.2, 0.8, 0.2, 1] },
      },
    },
    windowClose: {
      exit: {
        opacity: 0,
        scale: 0.95,
        transition: { duration: 0.12, ease: 'easeIn' },
      },
    },
    windowMinimize: {
      exit: { opacity: 0, scale: 0.5, y: 150, transition: { duration: 0.2 } },
    },
    dockBounce: {
      animate: {
        y: [0, -16, 0, -8, 0],
        transition: { duration: 0.4, ease: 'easeInOut' },
      },
    },
  },

  tokens: {
    'font-family': 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    'accent-color': '#6366f1',
  },
}
