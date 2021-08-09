const jf = require('jscodeshift')

function removeConsole(value) {
  return jf(value)
      .find(jf.ExpressionStatement, { expression: { callee: { object: { name: 'console' } } } })
      // .forEach(path => {
      //   jf(path).replaceWith('')
      // })
      .replaceWith(() => '')
      // .replaceWith(p => jf.identifier(p.node.name.split('').reverse().join('')))
      .toSource()
}


class RemoveConsoleWebpackPlugin {
  constructor(options) {
    console.log("插件的参数", options);
    let include = options && options.include;
    let removed = ['log']; // 默认清除的方法

    if (include) {
      if (!Array.isArray(include)) {
        console.error('options.include must be an Array.');
      } else if (include.includes('*')) {
        // 传入 * 表示清除所有 console 的方法
        removed = Object.keys(console).filter(fn => {
          return typeof console[fn] === 'function';
        })
      } else {
        removed = include; // 根据传入配置覆盖
      }
    }

    this.removed = removed;
  }
  apply(compiler) {
    // 开始执行插件
    // console.log('apply-----', compiler)
    // console.log('====')
    // compiler.hooks.initialize.tap("webapck remove console", (params) => {
    //   console.log('params', compiler)
    // })
    // js 资源代码处理函数
    let assetsHandler = (assets, compilation) => {
      let removedStr = this.removed.reduce((a, b) => a + "|" + b);

      let reDict = {
        1: [RegExp(`\\.console\\.(${removedStr})\\(\\)`, "g"), ""],
        2: [RegExp(`\\.console\\.(${removedStr})\\(`, "g"), ";("],
        3: [RegExp(`console\\.(${removedStr})\\(\\)`, "g"), ""],
        4: [RegExp(`console\\.(${removedStr})\\(`, "g"), "("],
      };
      Object.entries(assets).forEach(([filename, source]) => {
        // 匹配js文件
        if (/\.js$/.test(filename)) {
          // 处理前文件内容
          let outputContent = source.source();
          // console.log('outputContent1', outputContent)
          // Object.keys(reDict).forEach((i) => {
          //   let [re, s] = reDict[i];
          //   console.log('re', re)
          //   console.log('s', s)
          //   outputContent = outputContent.replace(re, s);
          // });
          // console.log('outputContent2', outputContent)
          outputContent = removeConsole(outputContent)
          compilation.assets[filename] = {
            // 返回文件内容
            source: () => {
              return outputContent;
            },
            // 返回文件大小
            size: () => {
              return Buffer.byteLength(outputContent, "utf8");
            },
            map: () => {
              return ''
            }
          };
        }
      });
    };
    /**
     * 通过 compiler.hooks.compilation.tap 监听事件
     * 在回调方法中获取到 compilation 对象
     */
    compiler.hooks.compilation.tap(
      "RemoveConsoleWebpackPlugin",
      (compilation) => {
        // webpack 5
        if (compilation.hooks.processAssets) {
          compilation.hooks.processAssets.tap(
            { name: "RemoveConsoleWebpackPlugin" },
            (assets) => assetsHandler(assets, compilation)
          );
        } else if (compilation.hooks.optimizeAssets) {
          // webpack 4
          compilation.hooks.optimizeAssets.tap(
            "RemoveConsoleWebpackPlugin",
            (assets) => assetsHandler(assets, compilation)
          );
        }
      }
    );
  }
}

module.exports = RemoveConsoleWebpackPlugin;
