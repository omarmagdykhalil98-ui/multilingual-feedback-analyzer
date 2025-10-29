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
        primary: '#00A878',
        secondary: '#1F2937',
        background: '#F9FAFB',
        card: '#FFFFFF',
        error: '#EF4444',
        success: '#10B981',
        neutral: '#6B7280',
        dark: {
          background: '#111827',
          card: '#1F2937',
          secondary: '#F9FAFB',
        }
      },
    },
  },
  plugins: [],
}
