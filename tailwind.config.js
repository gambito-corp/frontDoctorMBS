/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tema1: '#195b81',   // Color primario (puede usarse en botones, encabezados, etc.)
        tema2: '#5b8080',   // Color secundario (ideal para textos o acentos)
        tema3: '#157b80',   // Color terciario (para detalles, hover, etc.)
        footer: '#185b81',   // Color específico para el fondo del footer
      },
      fontFamily: {
        sans: ['Montserrat', ...defaultTheme.fontFamily.sans],
      },
      backgroundImage: {
        'text-gradient': 'linear-gradient(84deg, #195b81 24.87%, #5b8080 61.64%)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
