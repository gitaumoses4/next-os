const { heroui } = require('@heroui/react')
const path = require('path')

// Resolve actual HeroUI theme path through pnpm's node_modules
const heroThemePath = path.dirname(require.resolve('@heroui/theme/package.json'))

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    `${heroThemePath}/dist/**/*.{js,ts,jsx,tsx}`,
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [heroui()],
}
