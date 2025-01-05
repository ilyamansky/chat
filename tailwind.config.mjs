/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "custom-bg-gray": "#F1F5F9",
        "custom-bg-gray-light": "#E3E3E3",
        "custom-blue-light": "#6E9DD0",
        "custom-placeholder-gray": "#CACACA",
        "custom-blue": "#4766FF",
        "custom-text-gray": "#858B97",
        "custom-gray-md": "#EBEEFF",
        "custom-gray-dark": "#64748B",
        "custom-gray-filter": "#858585",
        "custom-gray-filter-dark": "#626782",
        "custom-gray-filter-light": "#94A3B8",
        "custom-gray-details": "#9B9B9B",
        "custom-orange": "#B67E34",
        "custom-orange-bg": "#FCF8EC",
        "custom-orange-border": "#9E6D2D",
        "custom-gray-thin": "#8B9CBE",
      },
    },
  },
  plugins: [],
};
