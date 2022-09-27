/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: 'Quicksand, sans-serif',
        body: 'Quicksand, sans-serif',
        sans: 'Quicksand, sans-serif',
        logo: 'Pacifico, sans-serif',
      },
      colors: {
        'brand-100': '#F2789F',
        'brand-200': '#F999B7',
        'brand-300': '#FEE3EC',
      },
    },
  },
  plugins: [],
}
