# 安装 webpack 基本依赖

> yarn add --dev webpack webpack-cli

- 运行

> npx webpack

# 把 ES6(及以上) 转换成 ES5 代码

- 所需依赖 -- babel

> yarn add --dev babel-loader @babel/core @babel/preset-env @babel/plugin-transform-runtime @babel/plugin-proposal-decorators @babel/plugin-proposal-class-properties @babel/plugin-proposal-private-methods

> yarn add @babel/runtime @babel/runtime-corejs3

## 具体作用

- babel-loader
  webpack 的插件，在 webpack 打包时用来加载代码(webpack 使用)

- @babel/core
  babel 的核心包，包含语法转换的 API，主要用转化 es6+ 的语法(用于语法转换)

- @babel/polyfill
  babel 垫片，主要作用是兼容 es6+新特性（如 promise，set 等），本质是由 core-js 和 regenerator-runtime 组成的。(babel7.4 以后官方以不推荐使用 用 core-js3 代替)

- core-js
  给低版本浏览器提供 es6+新特性接口的库。分为 core-js@2 和@core-js@3

- regenerator-runtime
  regenerator-runtime 模块来自 facebook 的 regenerator 模块,主要作用是生成器函数、async、await 函数经 babel 编译后，regenerator-runtime 模块用于提供功能实现

- @babel/helpers
  用来把@babel/core 处理的代码中插入的帮助函数当做一个模块引入，减小代码的体积

- @babel/plugin-transform-runtime
  用来引入垫片(?)的插件， 避免污染全局变量环境&按需引入

- @babel/runtime
  包含@babel/helpers 和 regenerator-runtime(只是以模块化方式包含函数实现的包)

- @babel/runtime-corejs2
  由 core-js@2、@babel/helpers 和 regenerator-runtime 组成
  @babel/runtime-corejs2 不能转化对象实例的方法

- @babel/runtime-corejs3
  由 core-js@3、@babel/helpers 和 regenerator-runtime 组成
  @babel/runtime-corejs3 可以转化对象实例的方法

## 配置代码

- webpack.config.js

```js
const path = require("path");

module.exports = {
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.[contenthash:8].js",
  },
  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },
};
```

.babelrc

```js
{
  "presets": ["@babel/preset-env"],
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "corejs": 3
      }
    ],
    [
      "@babel/plugin-proposal-decorators",
      {
        "legacy": true
      }
    ],
    [
      "@babel/plugin-proposal-class-properties",
      {
        //   当 时true，类属性被编译为使用赋值表达式而不是Object.defineProperty
        "loose": true
      }
    ],
    [
      "@babel/plugin-proposal-private-methods",
      {
        // 私有方法将通过Object.defineProperty而不是 a直接分配给其父方法WeakSet。这将导致更高的性能和调试
        "loose": true
      }
    ]
  ]
}
```

# 指定的 html 文件作为模板来使用

- 所需插件 -- html-webpack-plugin

> yarn add --dev html-webpack-plugin

## html 文件

- public/index.html

## 配置 webpack

webpack.config.js

```js
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  // ……
  plugins: [new HtmlWebpackPlugin()],
};
```

## 参数

例：我想把 js 的存放位置改成 body
? title 没有生效

````js
new HtmlWebpackPlugin({
      // webpack模板的相对或绝对路径
      template: path.resolve(__dirname, './public/index.html'),
      // js资源的放置位置 true || 'head' || 'body' || false
      // 传递true将根据scriptLoading选项将其添加到头部/身体。通过false将禁用自动注射
      inject: 'body',
      // 'blocking'|'defer'
      // defer: 支持非阻塞 javascript 加载 ( 'defer') 以提高页面启动性能
      scriptLoading: 'blocking',
    }),
    ```
````

- 更多参数请查阅
  https://github.com/jantimon/html-webpack-plugin#options

# 热更新

- 所需依赖 -- webpack-dev-server

> yarn add --dev webpack-dev-server

## 配置 webpack

webpack.config.js

```js
module.exports = {
  // ...
  devServer: {
    port: "8080", // 开启的端口号，一般是 8080
    hot: true, // 是否启用 webpack 的 Hot Module Replacement 功能，也就是模块热替换
    stats: "errors-only", // 终端仅打印 error
    compress: true, // 是否启用 gzip 压缩
  },
};
```

## 应用命令

> webpack server --open

- package.json 配置

```json
"scripts": {
    "start": "webpack serve  --open"
}
```

> yarn start

# 清除旧的打包配置

在 output 字段中添加 clean: true 即可实现与 clean-webpack-plugin 相同的效果

# 环境拆分

- 所需插件 -- webpack-merge

> yarn add --dev webpack-merge

## 拆分文件

在 build 目录下创建 webpack.base.config.js（公共部分）、webpack.dev.config.js（开发部分）、webpack.prod.config.js（生产部分） 三个文件。

- 把 devServer 和 mode 拆分出去
- 在 pre 和 prod 中引入 base

* webpack.dev.config.js

```js
const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.base.config");

module.exports = merge(baseConfig, {
  mode: "development",
  devServer: {
    port: "8080", // 默认是 8080
    hot: true,
    stats: "errors-only", // 终端仅打印 error
    compress: true, // 是否启用 gzip 压缩
  },
});
```

- prod 不需要 devServer

* webpack.prod.config,js

```js
const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.base.config");

module.exports = merge(baseConfig, {
  mode: "production",
});
```

- 更新命令

* package.json

```json
"scripts": {
    "start": "webpack serve --config build/webpack.dev.config.js --open",
    "build": "npx webpack --config build/webpack.prod.config.js"
}
```

# 支持 sass 和 css

- 所需插件 -- sass dart-sass sass-loader css-loader style-loader

> yarn add --dev sass dart-sass sass-loader css-loader style-loader

- node-sass VS dark-sass

* node-sass 是用 node(调用 cpp 编写的 libsass)来编译 sass；
  dart-sass 是用 drat VM 来编译 sass；
* node-sass 是自动编译实时的，dart-sass 需要保存后才会生效
  推荐 dart-sass 性能更好（也是 sass 官方使用的），而且 node-sass 因为国情问题经常装不上

## webpack 配置

- webpack.base.config.js

```js
module.exports = {
  // ...
  module: {
    rules: [
      // ...
      {
        test: /\.(s[ac]ss|css)$/i,
        exclude: /node_modules/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
  // ...
};
```

## 支持 postcss

是一个用 JavaScript 工具和插件转换 CSS 代码的工具(自动兼容)

- 所需插件 -- autoprefixer postcss postcss-loader

> yarn add --dev autoprefixer postcss postcss-loader

### 配置 rules

```js
const autoprefixer = require('autoprefixer');

……
use: [
  "style-loader",
  "css-loader",
  "sass-loader",
  {
    loader: "postcss-loader",
    options: {
      postcssOption: {
        plugins: [["autoprefixer"]],
      },
    },
  },
];
```

- 更多参数设置
  https://github.com/postcss/autoprefixer#options
  https://postcss.org/api/

## 抽离 css 文件

- 所需插件 -- mini-css-extract-plugin

> yarn add --dev mini-css-extract-plugin

### 配置 use

- MiniCssExtractPlugin.loader 代替 style-loader

* 二者不能同时存在 style-loader 会报错

```js
MiniCssExtractPlugin.loader,
```

### 配置 plugins

```js
plugins: [
  // 省略...
  new MiniCssExtractPlugin({
    filename: 'css/[name].css',
  }),
],
```

# 将 public 中的静态资源直接复制到打包目录

- 所需插件 -- copy-webpack-plugin

> yarn add --dev copy-webpack-plugin

## 配置 plugins

```js
plugins: [
  new CopyWebpackPlugin({
    patterns: [
      {
        from: "*",
        context: path.resolve(rootDir, "public"),
        to: path.resolve(rootDir, "dist"),
        globOptions: {
          ignore: path.resolve(rootDir, "public/index.html"), // 需除去index.html,因为打包时会生成造成冲突
        },
      },
    ],
  }),
];
```

## 加载图片资源

### webpack4

raw-loader、url-loader、file-loader

### webapck5

```js
rules: [
  // ...
  {
    test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
    type: "asset",
  },
];
```

---进阶

# 缓存优化

- webpack.dev.config.js

```js
cache: {
  type: "memory", // 相当于true
},
```

- webpack.prod.config.js

```js
cache: {
  type: "filesystem", // 触发buildDependencies
  buildDependencies: {
    config: [__filename], // 定义缓存路径
  },
},
```

# 拆分代码

```js
optimization: {
  splitChunks: {
    chunks: 'all' // 代码分割类型：all全部模块，async异步模块，initial入口模块
  }
},
```

# 多线程打包

- 所需插件 -- thread-loader

> yarn add --dev thread-loader

在使用线程的 use 中使用

- 注：
  loader 的执行顺序--从下向上
