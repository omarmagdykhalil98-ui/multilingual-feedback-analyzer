/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
extend: {
  colors: {
    primary: "#14B8A6", // vibrant teal
    secondary: "#1F2937",
    background: "#F3F4F6",
    dark: {
      card: "#2D3748",
      background: "#1A202C",
    },
  },
},
  },
  plugins: [],
};
