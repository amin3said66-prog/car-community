/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          cyan:       '#22d3ee',
          'cyan-lt':  '#67e8f9',
          purple:     '#a855f7',
          'purple-lt':'#c084fc',
          'purple-dk':'#9333ea',
          teal:       '#06b6d4',
          amber:      '#f59e0b',
          green:      '#4ade80',
          red:        '#f87171',
          dark:       '#0f172a',
          mid:        '#2d1b69',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateY(-16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        shimmer:  'shimmer 1.5s infinite',
        'slide-in': 'slideIn 0.4s ease-out',
      },
    },
  },
  plugins: [],
}
