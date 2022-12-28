// Helper for combining webpack config objects
const { merge } = require('webpack-merge')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

module.exports = (config, context) => {
  return merge(config, {
    plugins: [new NodePolyfillPlugin()],
    module: {
      rules: [
        {
          test: /\.svg$/,
          use: ['@svgr/webpack'],
        },
      ],
    },
  })
}
