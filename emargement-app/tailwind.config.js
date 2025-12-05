/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'slide-down': 'slide-down 0.3s ease-out',
        'pulse-ring': 'pulse-ring 2s ease-in-out infinite',
        'scan-line': 'scan-line 2s ease-in-out infinite',
      },
      keyframes: {
        'slide-down': {
          'from': { transform: 'translate(-50%, -100%)', opacity: '0' },
          'to': { transform: 'translate(-50%, 0)', opacity: '1' },
        },
        'pulse-ring': {
          '0%, 100%': { transform: 'scale(0.95)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.8' },
        },
        'scan-line': {
          '0%': { top: '0' },
          '100%': { top: '100%' },
        },
      },
    },
  },
  plugins: [],
}
