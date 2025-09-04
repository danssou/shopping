import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        // Dark mode color palette
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        // Nike brand colors
        nike: {
          orange: '#ff6900',
          red: '#e60012',
          black: '#111111',
          gray: '#7e7e7e',
        }
      },
      fontFamily: {
        sans: ['var(--font-jost-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jost-mono)', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
