const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const fs = require('fs')

const init = {
  src: '../src',
  dest: '../public'
}

const isDevelopment = process.env.NODE_ENV === 'development'

module.exports = {
  entry: './src',
  output: {
    path: path.resolve(__dirname, `${init.dest}`),
    filename: isDevelopment ? 'index.js' : 'index.[hash].js'
  },

  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      '@': path.resolve(__dirname, '../src')
    }
  },

  optimization: {
    usedExports: true
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: [/.css$/],
        use: [
          isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                hashPrefix: 'hash',
                localIdentName: '[name]__[local]'
              }
            }
          }
          // {
          //   loader: 'postcss-loader',
          //   options: {
          //     config: {
          //       path: 'postcss.config.js'
          //     }
          //   }
          // }
        ],
        exclude: /\.module\.css$/
      },
      {
        test: /\.(png|jp(e*)g|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/'
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        loader: 'svg-url-loader',
        options: {
          noquotes: true
        }
      }
    ]
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: isDevelopment ? '[name].css' : 'app.[contenthash].css',
      chunkFilename: isDevelopment ? '[id].css' : '[id].[contenthash].css'
    })
  ].concat(generateHtmlPlugins(path.resolve(__dirname, `${init.src}/html`)))
}

function generateHtmlPlugins (templateDir) {
  function getListFile (dir) {
    return fs.readdirSync(dir).reduce(function (files, file) {
      const name = path.join(dir, file)
      const isDir = fs.statSync(name).isDirectory()
      return files.concat(isDir ? getListFile(name) : name)
    }, [])
  }

  return getListFile(templateDir).map(item => {
    const itemPath = item.split(templateDir).join('').split('/')

    // Get name of file
    const name = itemPath[itemPath.length - 1].split('.')[0]

    // Remmove '/' on itemPath
    itemPath.shift()
    // Remmove '*.[ext]' on itemPath
    itemPath.pop()

    // Get path to file name
    const outerPath = itemPath.join('/')

    // Create new HtmlWebpackPlugin with options
    return new HtmlWebpackPlugin({
      filename: outerPath === '' ? `${name}.html` : `${outerPath}/${name}.html`,
      template: item,
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true
      }
    })
  })
}
