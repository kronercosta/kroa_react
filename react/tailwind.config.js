/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'krooa-green': '#D8FE64',
        'krooa-blue': '#30578D',
        'krooa-dark': '#001F2B',
      },
      fontFamily: {
        'manrope': ['Manrope', '"Manrope Fallback"'],
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}