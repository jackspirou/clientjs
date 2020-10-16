'use strict';

const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: { client: path.resolve(__dirname, './src/client.js') },
  devtool: 'source-map',
  mode: 'production',
  node: false,
  output: {
    globalObject: 'this',
    libraryTarget: 'umd',
    filename: '[name].min.js',
    path: path.resolve(__dirname, './dist'),
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: {},
          compress: {},
          mangle: true,
          ie8: true,
          safari10: true,
        },
        extractComments: false,
      }),
    ],
  },
};
