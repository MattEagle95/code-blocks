const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  entry: {
    app: ['babel-polyfill', './src/']
  },
  output: {
    path: __dirname,
    filename: './dist/[name].js'
  },
  resolve: {
    extensions: ['', '.js']
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel-loader'],
      include: path.resolve(__dirname, 'src')
    }]
  }
}
