/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // "./src/**/*.{html, js, tsx, jsx, ts}"
    './public/index.html',
    './src/**/*.{tsx,js,ts}',
    './src/views/**/*.{tsx,js,ts}',
    './src/components/**/*.{tsx,js,ts}',
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
}