/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E8F2FF',     // Very light blue
          100: '#D1E5FF',    // Light blue
          200: '#A3CBFF',    // Medium light blue
          300: '#75C2F6',    // Your light blue
          400: '#1D5D9B',    // Your main blue
          500: '#164A7B',    // Darker blue
          600: '#0F375B',    // Very dark blue
        },
        accent: {
          50: '#FEFCF0',     // Very light cream
          100: '#FBEEAC',    // Your cream color
          200: '#F4D160',    // Your yellow
          300: '#E6BC3A',    // Darker yellow
          400: '#D4A71A',    // Golden yellow
        },
        gold: {
          50: '#FFFDF7',
          100: '#FBEEAC',
          200: '#F4D160',
          300: '#E6BC3A',
          400: '#D4A71A',
        }
      },
      fontFamily: {
        'display': ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}