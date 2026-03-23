import type { OSTheme } from './types'

export const ubuntuTheme: OSTheme = {
  name: 'ubuntu',

  windowChrome: {
    borderRadius: '6px',
    titlebarHeight: 38,
    titlebarBg: '#3d3d3d',
    titlebarBgUnfocused: '#2c2c2c',
    titlebarTextColor: '#ffffff',
    controlStyle: 'traffic-lights',
    controlsPosition: 'left',
    shadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
    shadowFocused: '0 4px 12px rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    glassBg: '#2c2c2c',
    glassBlur: 'none',
  },

  dock: {
    position: 'bottom',
    height: 56,
    itemSize: 40,
    gap: 6,
    bg: 'rgba(30, 30, 30, 0.85)',
    blur: 'blur(12px)',
    borderRadius: '12px',
    padding: '4px 8px',
    magnification: false,
    runningIndicatorColor: '#e95420',
  },

  taskbar: {
    position: 'top',
    height: 28,
    bg: '#2c2c2c',
    blur: 'none',
    itemActiveBg: 'rgba(255, 255, 255, 0.1)',
    textColor: '#ffffff',
  },

  desktop: {
    iconSize: 56,
    iconLabelColor: '#ffffff',
    iconLabelShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
    iconSelectedBg: 'rgba(233, 84, 32, 0.3)',
    gridGap: 12,
    gridPadding: '20px',
  },

  animation: {
    windowOpen: {
      initial: { opacity: 0, scale: 0.92 },
      animate: { opacity: 1, scale: 1, transition: { duration: 0.15, ease: 'easeOut' } },
    },
    windowClose: {
      exit: { opacity: 0, scale: 0.92, transition: { duration: 0.12, ease: 'easeIn' } },
    },
    windowMinimize: {
      exit: { opacity: 0, y: 150, transition: { duration: 0.2 } },
    },
    dockBounce: {
      animate: {
        y: [0, -12, 0, -6, 0],
        transition: { duration: 0.35, ease: 'easeInOut' },
      },
    },
  },

  tokens: {
    'font-family': '"Ubuntu", "Noto Sans", system-ui, sans-serif',
    'accent-color': '#e95420',
  },
}
