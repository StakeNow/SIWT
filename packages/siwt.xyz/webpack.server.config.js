const path = require('path')

module.exports = () => {
  console.log(path.join(process.cwd(), 'dist/packages/siwt.xyz/server/'))
  return {
  mode: 'production',
  entry: './packages/siwt.xyz/server/index.ts',
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.ts'],
  },
  output: {
    libraryTarget: 'commonjs2',
    path: path.join(process.cwd(), 'dist/packages/siwt.xyz/server/'),
    filename: 'index.js',
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
        ],
      },
    ],
  },
  plugins: [],
}}
