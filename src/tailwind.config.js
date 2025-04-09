// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#be262d',
          50: '#fdf3f3',
          100: '#fde3e4',
          200: '#fcccce',
          300: '#f8a9ad',
          400: '#f2777d',
          500: '#e74c53',
          600: '#d32f37',
          700: '#be262d',
          800: '#932126',
          900: '#7a2226',
          950: '#420d0f',
        },
        neutral: {
          50: '#f7f7f7',
          100: '#eeeeee',
          200: '#e0e0e0',
          300: '#cacaca',
          400: '#b1b1b1',
          500: '#999999',
          600: '#7f7f7f',
          700: '#676767',
          800: '#545454',
          900: '#464646',
          950: '#282828',
        }
      }
    }
  },
  plugins: [],
}