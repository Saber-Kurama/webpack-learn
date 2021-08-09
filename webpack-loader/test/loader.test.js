'use strict'

const webpack = require('./helpers/compiler')

describe('Loader', () => {
  test('Defaults', () => {
    const config = {
      loader: {
        test: /\.html$/,
        options: {
          // logName: 'saber'
        }
      }
    }
    console.log('???', webpack)
    return webpack('fixture.js', config)
      .then((stats) => {
        const { modules } = stats.toJson({ source: true });
        const { assets, source } = modules[1];
        console.log('module', source)
        expect(source).toMatchSnapshot()
      })
      .catch((err) => err)
  })
})