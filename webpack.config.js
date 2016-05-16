var webpack = require('webpack')
var path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {

  devtool: 'source-map',

  entry: {
    'index': './index.js'
  },

  output: {
    path: path.resolve(__dirname, 'public'),
    filename: process.env.NODE_ENV ?
      '[name]-[chunkhash].js' : '[name].js',
    sourceMapFilename: '[file].map.json'
  },

  module: {
    loaders: [
      { test: /\.js$/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        },
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass']
      }
    ]
  },

  resolve: {
    extensions: ['', '.js']
  },

  plugins: [
    new HtmlWebpackPlugin(),
  ],

  devServer: {
    contentBase: 'public',
    proxy: { '*': 'http://localhost:8000' }
  }

}