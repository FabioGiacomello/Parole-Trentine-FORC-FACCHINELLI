/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        trentino: {
          red: '#CE2B37',
          dark: '#1A1A1A'
        }
      }
    }
  }
}
