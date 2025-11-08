/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.ejs",     // <--- importante: ** incluye subcarpetas (auth, proveedor, etc.)
    "./public/**/*.html",
    "./src/**/*.js"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
