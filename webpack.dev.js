const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');

common.entry = [
  'webpack-hot-middleware/client',
  './src/App.jsx',
];

// common.output.publicPath = '/';

common.plugins = [
  ...common.plugins,
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
];

module.exports = merge(common, {
  mode: 'development',
  optimization: {
    usedExports: true,
  },
  // when using webpack-dev-middleware with custom Express server, these options are overwritten
  devServer: {
    contentBase: './dist',
    compress: true,
    hot: true,
    port: 9000,
  },
  devtool: 'eval-source-map',
});

