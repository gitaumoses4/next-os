import type { OSTheme } from './types'

export const windows11Theme: OSTheme = {
  name: 'windows11',

  windowChrome: {
    borderRadius: '8px',
    titlebarHeight: 36,
    titlebarBg: '#f3f3f3',
    titlebarBgUnfocused: '#f9f9f9',
    titlebarTextColor: '#1a1a1a',
    controlStyle: 'squares',
    controlsPosition: 'right',
    shadow: '0 2px 8px rgba(0, 0, 0, 0.15), 0 0 1px rgba(0, 0, 0, 0.1)',
    shadowFocused: '0 4px 16px rgba(0, 0, 0, 0.2), 0 0 1px rgba(0, 0, 0, 0.15)',
    border: '1px solid rgba(0, 0, 0, 0.08)',
    glassBg: '#ffffff',
    glassBlur: 'none',
  },

  dock: {
    position: 'bottom',
    height: 52,
    itemSize: 32,
    gap: 4,
    bg: '#f3f3f3',
    blur: 'none',
    borderRadius: '8px',
    padding: '4px 8px',
    magnification: false,
    runningIndicatorColor: '#0078d4',
  },

  taskbar: {
    position: 'bottom',
    height: 48,
    bg: '#f3f3f3',
    blur: 'blur(20px)',
    itemActiveBg: 'rgba(0, 120, 212, 0.08)',
    textColor: '#1a1a1a',
  },

  desktop: {
    iconSize: 56,
    iconLabelColor: '#ffffff',
    iconLabelShadow: '0 1px 4px rgba(0, 0, 0, 0.7)',
    iconSelectedBg: 'rgba(0, 120, 212, 0.25)',
    gridGap: 8,
    gridPadding: '16px',
  },

  animation: {
    windowOpen: {
      initial: { opacity: 0, scale: 0.96, y: 8 },
      animate: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: 0.15, ease: [0.16, 1, 0.3, 1] },
      },
    },
    windowClose: {
      exit: {
        opacity: 0,
        scale: 0.96,
        y: 8,
        transition: { duration: 0.1, ease: 'easeIn' },
      },
    },
    windowMinimize: {
      exit: { opacity: 0, scale: 0.6, y: 100, transition: { duration: 0.15 } },
    },
    dockBounce: {
      animate: {
        y: [0, -8, 0],
        transition: { duration: 0.3, ease: 'easeInOut' },
      },
    },
  },

  tokens: {
    'font-family': '"Segoe UI", "Segoe UI Variable", system-ui, sans-serif',
    'accent-color': '#0078d4',
  },
}
