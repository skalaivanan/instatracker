/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff0f5',
          100: '#ffe0eb',
          200: '#ffb3cc',
          300: '#ff80aa',
          400: '#ff4d88',
          500: '#e1306c',
          600: '#c62a60',
          700: '#a02050',
          800: '#7a1840',
          900: '#54102c',
        },
        purple: {
          50: '#f5f0ff',
          100: '#ede0ff',
          500: '#833ab4',
          600: '#6b2fa0',
        },
        orange: {
          500: '#fd1d1d',
          600: '#e01818',
        },
        gold: {
          500: '#fcb045',
          600: '#e8a03e',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'ig-gradient': 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
        'ig-gradient-soft': 'linear-gradient(135deg, #fcb045 0%, #fd1d1d 50%, #833ab4 100%)',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 12px 0 rgba(0, 0, 0, 0.10), 0 2px 6px -1px rgba(0, 0, 0, 0.08)',
        'glow': '0 0 20px rgba(225, 48, 108, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
