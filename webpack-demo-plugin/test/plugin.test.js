'use strict'

const webpack = require('./helpers/compiler')
const RemoveConsoleWebpackPlugin = require('../lib')

describe('Loader', () => {
  test('Defaults', () => {
    const config = {
      plugins:[
        new RemoveConsoleWebpackPlugin({})
      ] 
    }
    return webpack('fixture.js', config)
      .then((stats) => {
        const { modules } = stats.toJson({ source: true });
        const { assets, source } = modules[1];
        console.log('module', source)
        // expect(source).toMatchSnapshot()
      })
      .catch((err) => err)
  })
})