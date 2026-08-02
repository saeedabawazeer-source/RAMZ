/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#131110",
        paper: "#F6EFE3",
        teal: { DEFAULT: "#0B7A75", light: "#17A099", dark: "#07514D" },
        accent: { DEFAULT: "#7A5CFA", light: "#9B85FF", dark: "#5A3FD1" },
      },
      borderRadius: { brand: "8px" },
      fontFamily: {
        display: ["var(--font-display)", "Space Grotesk", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      boxShadow: {
        brand: "4px 4px 0px #131110",
        "brand-lg": "6px 6px 0px #131110",
        "brand-xl": "8px 8px 0px #131110",
        "brand-hover": "8px 8px 0px #131110",
        "brand-accent": "10px 10px 0px #7A5CFA",
      },
    },
  },
  plugins: [],
};
