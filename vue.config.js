'use strict'
const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  configureWebpack: config => {
    config.name = 'this is demo';
    config.module.rules.push({
      test: /\.less$/,
      loader: 'less-loader'
    })
  },
  chainWebpack: config => {
    config.resolve.alias.set('@', resolve('src'))
  }
}