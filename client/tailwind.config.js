/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Triage signal palette — reused across the UI for consistency.
        safe: "#16a34a",
        caution: "#d97706",
        danger: "#dc2626",
        brand: "#0f766e",
      },
    },
  },
  plugins: [],
};
