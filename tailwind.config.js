/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue_custom: '#1a3d7d', customBlue: '#1DB4C5',
        customLightBlue: 'rgba(28, 178, 194, 0.75)',
        transparentLight: 'rgba(26, 175, 190, 0.00)',
      }
    },
  },
  plugins: [],
}