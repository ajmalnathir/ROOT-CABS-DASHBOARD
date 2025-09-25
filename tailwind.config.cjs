/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html",
  ],
  safelist: [
    // Status badge colors used in DriverTable.tsx
    'bg-green-100', 'text-green-800',
    'bg-yellow-100', 'text-yellow-800',
    'bg-gray-100', 'text-gray-800',
    // Custom dashboard background utility
    'bg-dashboard-section',
  ],
  theme: {
    extend: {
      colors: {
        // Enables using the Tailwind utility `bg-dashboard-section`
        'dashboard-section': '#c0c8cf',
      },
    },
  },
  plugins: [],
};