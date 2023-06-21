const { createGlobPatternsForDependencies } = require('@nx/react/tailwind')
const { join } = require('path')
const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    join(__dirname, '{src,pages,components}/**/*!(*.stories|*.spec).{ts,tsx,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
    colors: {
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      red: colors.red,
      yellow: colors.yellow,
      green: colors.green,
      indigo: colors.indigo,
      orange: {
        ...colors.orange,
        DEFAULT: '#ff584d',
      },
    },
    fontFamily: {
      sans: ['sans-serif'],
    },
  },
  plugins: [],
}
