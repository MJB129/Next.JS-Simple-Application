const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./src/**/*.js', './public/**/*.html'],
  darkMode: 'media',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
        'open-sans': ['Open Sans'],
        poppins: ['Poppins'],
      },
      colors: {
        primary: '#0071F9',
      },
      screens: {
        'md': '768px',
        'lg': '1024px',
        'xl': '1100px',
        '2xl': '1200px',
      },
      boxShadow: {
        colored: '0px 5px 20px rgba(222, 227, 249, 0.1)',
        card: '0px 5px 20px #A1A1A1',
        blueShadow: '0px 5px 20px #DEE3F9',
      },
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
