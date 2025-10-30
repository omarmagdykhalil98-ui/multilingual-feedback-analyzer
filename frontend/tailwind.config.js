/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#14B8A6',
        'primary-dark': '#0F766E',
        secondary: '#1F2937',
        accent: '#A3E635',
        background: '#F3F4F6',
        'text-primary': '#374151',
        error: '#EF4444',
        'dark-card': '#2D3748',
        'dark-background': '#1A202C',
        'dark-secondary': '#A0AEC0',
      },
    },
  },
  plugins: [],
};
