/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        chime: {
          50: '#edfff4',
          100: '#d5ffe6',
          200: '#aeffcf',
          300: '#70ffab',
          400: '#2bfd80',
          500: '#00e85c',
          600: '#00d54b',
          700: '#00a33a',
          800: '#068031',
          900: '#08692b',
          950: '#003b16',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        elevated: '0 4px 6px -1px rgb(0 0 0 / 0.06), 0 2px 4px -2px rgb(0 0 0 / 0.04)',
        glow: '0 0 20px -5px rgb(0 213 75 / 0.15)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'slide-down': 'slideDown 0.2s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'check-draw': 'checkDraw 0.6s ease-out forwards',
        'confetti-float': 'confettiFloat 3s ease-in-out infinite',
        shimmer: 'shimmer 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideDown: {
          '0%': { opacity: '0', maxHeight: '0' },
          '100%': { opacity: '1', maxHeight: '200px' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        checkDraw: {
          '0%': { strokeDashoffset: '40' },
          '100%': { strokeDashoffset: '0' },
        },
        confettiFloat: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)', opacity: '0.6' },
          '50%': { transform: 'translateY(-12px) rotate(180deg)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
