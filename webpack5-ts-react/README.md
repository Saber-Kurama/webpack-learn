
https://mp.weixin.qq.com/s/iomDg1Qg_1kKEkeo9EzbGQ

[学习 Webpack5 之路（实践篇）](https://juejin.cn/post/6991774994552324133#heading-28)
[从零使用 Webpack5 搭建一个完整的 Vue3 的开发环境](https://juejin.cn/post/6924180659829211143#heading-12)
[基于 vue3 + webpack 5 + sass+ vw 适配方案+axios 封装，从0构建手机端模板脚手架](https://juejin.cn/post/6989973871663251487#heading-18)
[Webpack5 从零配置一个基础的 Vue 项目](https://juejin.cn/post/6978832288586924046#heading-38)
[手写系列-实现一个铂金段位的 React](https://juejin.cn/post/6978654109893132318)
[前端工程化实战 - 自定义 React 脚手架 & CLI 升级](https://juejin.cn/post/6989028324202938398#heading-14)

loader 配置优化
这个其实上面已经做了。明确告诉 loader，哪些文件不用做处理(exclude)，或者只处理哪些文件(include)。

缓存
先说下 webpack5 之前是怎么做的。
利用 cache-loader 将结果缓存中磁盘中；利用 hard-source-webpack-plugin 将结果缓存在 node_modules/.cache 下提升二次打包速度；利用 DllReferencePlugin 将变化不频繁的第三方库提前单独打包成动态链接库，提升真正业务代码的打包速度

代码拆分

happypack

thread-loader