/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        cream: { DEFAULT: "#F5F1E8", muted: "#F2EBDD" },
        forest: { DEFAULT: "#1F3D2E", dark: "#16352A" },
        sage: "#7A8F6A",
        gold: "#C8A24B",
        stone: "#9C9B91",
        charcoal: "#2B2B2B",
      },
      fontFamily: {
        serif: ['"Playfair Display"', "Georgia", "serif"],
        display: ['"Cinzel"', '"Playfair Display"', "serif"],
        sans: ['"Lato"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 40px rgba(31,61,46,0.05)",
        lift: "0 20px 60px rgba(31,61,46,0.10)",
      },
      letterSpacing: {
        widest2: "0.3em",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
      },
      animation: {
        fadeUp: "fadeUp 0.8s ease-out forwards",
        fadeIn: "fadeIn 0.6s ease-out forwards",
      },
    },
  },
  plugins: [],
};
