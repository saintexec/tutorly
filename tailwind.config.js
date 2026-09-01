/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#022448",
        "primary-container": "#1e3a5f",
        "on-primary": "#ffffff",
        "on-primary-container": "#8aa4cf",
        surface: "#f7f9fb",
        "surface-container-low": "#f2f4f6",
        "surface-container": "#eceef0",
        "surface-container-lowest": "#ffffff",
        "on-surface": "#191c1e",
        "on-surface-variant": "#43474e",
        "outline-variant": "#c4c6cf",
      },
      borderRadius: {
        lg: "0.75rem",
        "2xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
