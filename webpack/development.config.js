const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const { DefinePlugin } = require('webpack')
const path = require('path')
const fs = require('fs')
const Dotenv = require('dotenv-webpack')

process.env.NODE_ENV = 'development'

const bin = path.resolve(__dirname, '..', 'bin')
const publicPath = path.resolve(__dirname, '..', 'public')

module.exports = {
  mode: 'development',
  name: 'client',
  watch: true,
  entry: [path.resolve(bin, 'client', 'index.jsx')],
  output: {
    path: path.resolve(bin, 'server', 'build'),
    publicPath: '/app',
    filename: '[name].[contenthash:8].js',
    chunkFilename: '[name].[contenthash:8].chunk.js'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      assets: path.resolve(bin, 'client', 'assets')
    }
  },
  optimization: {
    minimize: false,
    minimizer: [],
    splitChunks: {
      chunks: 'all'
    }
  },
  module: {
    strictExportPresence: true,
    rules: [
      { parser: { requireEnsure: false } },
      {
        test: /\.(js|jsx)$/,
        include: path.resolve(bin, 'client'),
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          cacheCompression: true,
          compact: true,
          presets: [
            '@babel/preset-react'
          ],
          plugins: [
            '@babel/plugin-syntax-dynamic-import',
            '@babel/plugin-proposal-class-properties',
            '@babel/plugin-proposal-export-default-from',
            '@babel/plugin-proposal-object-rest-spread'
          ]
        }
      },
      {
        test: /\.s?css$/,
        use: [
          MiniCSSExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass')
            }
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif|webp)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  },
  plugins: [
    new Dotenv({
      path: path.resolve(__dirname, '..', '.env')
    }),
    new HTMLWebpackPlugin({
      template: path.resolve(publicPath, 'index.html'),
      filename: 'index.html'
    }),
    new MiniCSSExtractPlugin({
      filename: '[name].[contenthash:8].css',
      chunkFilename: '[name].[contenthash:8].chunk.css'
    }),
    new DefinePlugin({
      __PAYPAL_ENV__: '"sandbox"'
    }),
    {
      apply: (compiler) =>
        compiler.hooks.compile.tap('miscFiles', () => {
          const appDir = path.resolve(bin, 'client')
          const appFile = fs.readFileSync(path.resolve(appDir, 'App.jsx'), 'utf8')

          const sitemapTemplate = fs.readFileSync(path.resolve(publicPath, 'sitemap.xml'), 'utf8')
          let sitemapLocations = ''
          for (const [, match] of appFile.matchAll(/path="(.*?)"/g)) {
            sitemapLocations += `<url><loc>https://points.city${match}</loc></url>`
          }

          fs.writeFileSync(
            path.resolve(publicPath, 'sitemap.xml'),
            sitemapTemplate.replace('$locations', sitemapLocations)
          )
          fs.copyFileSync(
            path.resolve(publicPath, 'robots.txt'),
            path.resolve(publicPath, 'robots.txt')
          )
        })
    }
  ]
}
