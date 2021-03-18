const safelist = require('./tailwind.safelist');

module.exports = {
  purge: {
    safelist,
    content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      zIndex: {
        101: '101',
        999: '999',
      },
      colors: {
        red: {
          600: '#cf0652',
        },
      },
      spacing: {
        50: '12.5rem',
        58: '14.5rem',
      },
      inset: {
        30: '7.5rem',
        50: '12.5rem',
      },
      minHeight: {
        9: '2.25rem',
      },
      width: {
        46: '11.5rem',
      },
      minWidth: {
        4: '1rem',
        9: '2.25rem',
        10: '2.5rem',
        46: '11.5rem',
        '1/2': '50%',
        '1/3': '33.333333%',
        '1/4': '25%',
        '1/5': '20%',
        '1/6': '16.666667%',
      },
      maxWidth: {
        screen: '100vw',
      },
    },
  },
  variants: {
    extend: {
      ringColor: ['hover', 'active'],
      divideColor: ['group-hover'],
      padding: ['last'],
    },
  },
  plugins: [],
};
