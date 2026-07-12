/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#714b67',
          50:  '#faf5f9',
          100: '#f3e8f0',
          200: '#e8d2e2',
          300: '#d4adc8',
          400: '#b980a6',
          500: '#9e6089',
          600: '#714b67',
          700: '#5e3d56',
          800: '#4e3347',
          900: '#3d2838',
          950: '#261828',
        },
      },
    },
  },
  plugins: [],
}
