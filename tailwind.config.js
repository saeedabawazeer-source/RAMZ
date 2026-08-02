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
    },
  },
  plugins: [],
};
