const merge = require('webpack-merge')
const path = require('path')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

const webpackBaseConfig = require('./webpack.base.config.js')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(webpackBaseConfig, {
  mode: 'development',

  devServer: {
    clientLogLevel: 'warning',
    contentBase: path.join(__dirname, 'public'),
    watchContentBase: true,
    hot: true,
    host: HOST || 'localhost',
    port: PORT || 8001,
    quiet: true, // necessary for FriendlyErrorsPlugin
    historyApiFallback: true
  }
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || 8001
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`]
        }
      }))

      resolve(devWebpackConfig)
    }
  })
})
