import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'main': '#FF4A01',
        'dark': '#33343F',
        'neutral': '#71737F'
      }
    },
  },
  plugins: [],
} satisfies Config

