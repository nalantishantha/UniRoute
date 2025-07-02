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
          50: '#1e293b',     // Dark blue-gray
          100: '#334155',    // Darker blue-gray
          200: '#475569',    // Medium dark blue
          300: '#64748b',    // Dark blue
          400: '#0f172a',    // Very dark blue
          500: '#020617',    // Almost black blue
          600: '#000000',    // Pure black
        },
        accent: {
          50: '#78350f',     // Dark brown-gold
          100: '#92400e',    // Dark amber
          200: '#b45309',    // Dark gold
          300: '#d97706',    // Rich dark yellow
        }
      },
      fontFamily: {
        'display': ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}