/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#eef3fb',
          100: '#d5e1f5',
          200: '#b0c7eb',
          300: '#7ea4da',
          400: '#4f7ec6',
          500: '#2e5fad',
          600: '#1e3a6b',
          700: '#162850',
          800: '#0f1e3e',
          900: '#0a1428',
          950: '#060d1c',
        },
        gold: {
          300: '#f0d07a',
          400: '#d4a843',
          500: '#c9a227',
          600: '#a8841d',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { opacity: 0, transform: 'translateY(16px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
