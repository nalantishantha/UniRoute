/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Neutral colors
        neutral: {
          black: "#263238",
          "dark-grey": "#4D4D4D",
          grey: "#717171",
          "light-grey": "#B0B0B0",
          silver: "#F5F7FA",
          white: "#FFFFFF",
        },
        // Primary colors
        primary: {
          DEFAULT: "#1D5D9B",
          50: "#E7F3FB",
          100: "#C1DBF4",
          200: "#9ABDE6",
          300: "#739ED1",
          400: "#4C7FB1",
          500: "#1D5D9B",
          600: "#174A7C",
          700: "#133E67",
          800: "#0F3252",
          900: "#0B263D",
          950: "#071B29",
        },
        // Secondary and action colors
        secondary: "#F4D160",
        info: "#75C2F6",
        warning: "#F4D160",
        error: "#E57373",
        success: "#81C784",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-in": "slideIn 0.3s ease-out",
        "bounce-in": "bounceIn 0.6s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        bounceIn: {
          "0%": { transform: "scale(0.3)", opacity: "0" },
          "50%": { transform: "scale(1.05)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
