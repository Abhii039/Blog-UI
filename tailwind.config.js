const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        crimson: ["'Crimson Pro'", 'serif'],
        cormorant: ["'Cormorant Garamond'", 'serif'],
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()]
};