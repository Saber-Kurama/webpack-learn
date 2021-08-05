const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: 'development',
  entry: "./src/index.js",
  output: {
    // filename: 'main.js',
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
    // assetModuleFilename: 'images/[hash][ext][query]'
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        // dependency: { not: ['url'] }, // 不是 url('./icon.jpg'); 的走 url-loader 其他的走 asset
        // use: [
        //   {
        //     loader: 'url-loader',
        //     options: {
        //       limit: 819200,
        //     }
        //   },
        // ],
        // type: 'javascript/auto'
        // type: 'asset',
        // type: 'asset/resource',
        // generator: {
        //   filename: 'static/[hash][ext][query]'
        // }
        type: "asset/inline",
        generator: {
          // dataUrl: content => {
          //   content = content.toString();
          //   return svgToMiniDataURI(content);
          // }
        },
      },
      {
        test: /\.txt/,
        // type: "asset/source",
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024 // 4kb
          }
        }
      },
      // 变更内联 loader 的语法

    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "管理输出",
    }),
  ],
};
