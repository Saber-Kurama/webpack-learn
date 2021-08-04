// const webpack = require("webpack");
// const options = require("../webpack.config.js");
// const compiler = webpack(options);
// compiler.run()

// 这个实现和 rollup的 实现相似
// 很多问题都没有解决，模块的的缓存的等等 重复依赖

// 1. 读取配置，合并配置
const fs = require("fs");
const parser = require("@babel/parser");
const travaerse = require("@babel/traverse").default;
const path = require("path");
const { transformFromAst } = require("@babel/core");

module.exports = class webpack {
  constructor(options) {
    console.log(options);
    const { entry, output } = options;
    this.entry = entry;
    this.output = output;
    this.modules = [];
  }
  run() {
    // 入口函数
    const info = this.parse(this.entry);
    this.modules.push(info);
    // 递归
    // 用双层for循坏 遍历modules，达到递归的效果
    for (let i = 0; i < this.modules.length; i++) {
      const item = this.modules[i];
      // 找到当前模块的依赖 解析 它的依赖模块 
      const yilai = item.yilai;
      if (yilai) {
        for (let j in yilai) {
          this.modules.push(this.parse(yilai[j]));
        }
      }
    }
    // console.log(this.modules)
    // 数据格式转换 arr to obj
    const obj = {};
    this.modules.forEach((item) => {
      obj[item.entryFile] = {
        yilai: item.yilai,
        code: item.code,
      };
    });
    console.log(obj)
    this.file(obj)
  }
  parse(entryFile) {
    // 解析模块
    const content = fs.readFileSync(entryFile, "utf-8");

    const ast = parser.parse(content, {
      sourceType: "module",
    });
    // console.log('ast', ast.program.body)
    const yilai = {};
    travaerse(ast, {
      ImportDeclaration({ node }) {
        const newPathName =
          "./" + path.join(path.dirname(entryFile), node.source.value);
        //把依赖的新路径和旧路径都保存下来
        yilai[node.source.value] = newPathName;
      },
    });
    console.log("yilai", yilai);
    const { code } = transformFromAst(ast, null, {
      presets: ["@babel/preset-env"],
    });
    console.log("code", code);
    return {
      entryFile,
      yilai,
      code,
    };
  }
  file(obj) {
    // 1. 生成bundle文件（需要从output配置字段拿到文件的存储位置和文件的名称）
    const bundlePath = path.join(this.output.path, this.output.filename);
    const newObj = JSON.stringify(obj);
    const content = `(function(modules){
        function require(module){
            // ./a.js ---> 是否可以拿到这个模块的code?
           
            function newRequire(relativePath){
                // 就是把相对于入口模块的路径替换成相对根目录的路径
               return require(modules[module].yilai[relativePath])
            }
            const exports = {};
            (function(exports,require,code){
                eval(code)
            })(exports,newRequire,modules[module].code)

            return exports;
        }
        require('${this.entry}')
    })(${newObj})`;

    fs.writeFileSync(bundlePath, content, "utf-8");
  }
};
