const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const path = require('path');
const rootDir = path.join(__dirname, '../..');
const staticDir = path.join(__dirname, './static');

const mode = process.env.NODE_ENV || 'development';
const isProd = mode === 'production';

module.exports = {
  mode,
  entry: {
    // options: './src/options/app.tsx',
    main: path.join(rootDir, './index.web.ts'),
    options: path.join(__dirname, './src/options/options.tsx'),
    background: path.join(__dirname, './src/background/background.ts'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: Object.assign({
      'react-native$': 'react-native-web',
    }),
  },
  plugins: [
    // new CopyWebpackPlugin({
      // patterns: [{ from: 'static', to: '.' }],
    // }),

    new CopyWebpackPlugin([
      { from: staticDir, to: '.' },
    ]),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '..', './index.html'),
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devtool: process.env.NODE_ENV === 'production' ? false : 'cheap-module-source-map',

  optimization: {
    minimize: isProd,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            pure_funcs: ['console.info', 'console.warn', 'console.time', 'console.timeEnd'],
          },
        },
      }),
    ],
  },
};
