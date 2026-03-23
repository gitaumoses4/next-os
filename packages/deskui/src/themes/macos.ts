import type { OSTheme } from './types'

export const macosTheme: OSTheme = {
  name: 'macos',

  windowChrome: {
    borderRadius: '10px',
    titlebarHeight: 40,
    titlebarBg: 'rgba(236, 236, 236, 0.85)',
    titlebarBgUnfocused: 'rgba(246, 246, 246, 0.9)',
    titlebarTextColor: '#1d1d1f',
    controlStyle: 'traffic-lights',
    controlsPosition: 'left',
    shadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
    shadowFocused: '0 12px 40px rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    glassBg: 'rgba(255, 255, 255, 0.7)',
    glassBlur: 'blur(20px)',
  },

  dock: {
    position: 'bottom',
    height: 72,
    itemSize: 48,
    gap: 4,
    bg: 'rgba(255, 255, 255, 0.2)',
    blur: 'blur(20px)',
    borderRadius: '16px',
    padding: '4px 8px',
    magnification: true,
    runningIndicatorColor: 'rgba(0, 0, 0, 0.5)',
  },

  taskbar: {
    position: 'bottom',
    height: 40,
    bg: 'rgba(236, 236, 236, 0.85)',
    blur: 'blur(20px)',
    itemActiveBg: 'rgba(0, 0, 0, 0.08)',
    textColor: '#1d1d1f',
  },

  desktop: {
    iconSize: 64,
    iconLabelColor: '#ffffff',
    iconLabelShadow: '0 1px 3px rgba(0, 0, 0, 0.6)',
    iconSelectedBg: 'rgba(0, 122, 255, 0.3)',
    gridGap: 16,
    gridPadding: '24px',
  },

  animation: {
    windowOpen: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1, transition: { duration: 0.12, ease: 'easeOut' } },
    },
    windowClose: {
      exit: { opacity: 0, scale: 0.95, transition: { duration: 0.1, ease: 'easeIn' } },
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
      '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", sans-serif',
    'accent-color': '#007aff',
  },
}
