const schema = require('./options.json')
const loaderUtils = require('loader-utils')
const {validate} = require('schema-utils')

module.exports = function loader(source, map, meta) {
  // Loader Options
  const options = loaderUtils.getOptions(this) || {}
  console.log('options', options)
  // 校验
  validate(schema, options, { name: 'webpack-dom-loader', baseDataPath: 'options' })
  console.log('经过这个loader, 不做任何处理')
  let result = `let __webpak_demo__ = "${source}"`
  return result
}