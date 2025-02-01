/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue_custom: 'rgb(var(--blue-custom))',
        blue_custom_hover: 'rgb(var(--blue-custom-hover))',
        blue_bright: 'rgb(var(--blue-bright))',
        customBlue: '#1DB4C5',
        customLightBlue: 'rgba(28, 178, 194, 0.75)',
        transparentLight: 'rgba(26, 175, 190, 0.00)',

        // Themed variables
        sidebarBackground: 'rgb(var(--bg-sidebar))',
        "main-background": 'rgb(var(--bg-main))',
        blocks: 'rgb(var(--bg-blocks))',
        'blocks-hover': 'rgb(var(--bg-blocks-hover))',
        "font-color": 'rgb(var(--font-color))',
        "shadow-color": 'rgba(var(--shadow-color))'
      }
    },
  },
  plugins: [],
}