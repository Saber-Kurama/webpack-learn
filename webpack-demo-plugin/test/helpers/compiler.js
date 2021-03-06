'use strict'

const path = require('path')
const del = require('del')
const webpack = require('webpack')
const MemoryFS = require('memory-fs')

const optimization = (config) => {
  return {
    splitChunks: {
      minChunks: Infinity
    }
  }
}

const modules = (config) => {
  return {
    rules: config.rules
      ? config.rules
      : config.loader
        ? [
          {
            test: config.loader.test || /\.txt$/,
            use: {
              loader: path.resolve(__dirname, '../../lib'),
              options: config.loader.options || {}
            }
          }
        ]
        : []
  }
}

const plugins = config => ([].concat(config.plugins || []))

const output = (config) => {
  return {
    path: path.resolve(
      __dirname,
      `../outputs/${config.output ? config.output : ''}`
    ),
    filename: '[name].js',
    chunkFilename: '[name].chunk.js'
  }
}

module.exports = function (fixture, config, options) {
  config = {
    mode: 'development',
    devtool: config.devtool || 'source-map',
    context: path.resolve(__dirname, '..', 'fixtures'),
    entry: `./${fixture}`,
    output: output(config),
    optimization: optimization(config),
    module: modules(config),
    plugins: plugins(config)
  }

  options = Object.assign({ output: false }, options)
  if (options.output) del.sync(config.output.path)
  
  const compiler = webpack(config)

  // if (!options.output) compiler.outputFileSystem = new MemoryFS()

  return new Promise((resolve, reject) => compiler.run((err, stats) => {
    if (err) reject(err)

    resolve(stats)
  }))
}