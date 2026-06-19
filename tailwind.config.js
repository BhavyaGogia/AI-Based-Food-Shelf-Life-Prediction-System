/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50:  '#f0faf4',
          100: '#dcf2e5',
          200: '#bbe5cd',
          300: '#8dd0ae',
          400: '#58b387',
          500: '#349768',
          600: '#247a52',
          700: '#1a4731', // brand primary
          800: '#163d2a',
          900: '#133324',
        },
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706', // brand accent
          700: '#b45309',
        },
        cream: {
          50: '#fefef9',
          100: '#fafaf5', // brand background
          200: '#f5f5e8',
        }
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
