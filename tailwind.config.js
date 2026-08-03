/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f2f7f7',
          100: '#e1ecec',
          200: '#c5d9d8',
          300: '#9ec0be',
          400: '#75a1a0',
          500: '#5B7B7A', // Primary accent
          600: '#4A6463', // Hover state
          700: '#3c5150',
          800: '#344342',
          900: '#2d3a39',
          950: '#1a2424',
        },
        surface: {
          DEFAULT: '#F9FAFB',
          card: '#FFFFFF',
          dark: '#1A1A1A',
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
