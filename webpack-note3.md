# tailwind

Tailwind 是一个 PostCSS 插件

- 项目依赖 -- tailwindcss@latest @fullhuman/postcss-purgecss cssnano

> yarn add --dev tailwindcss@latest @fullhuman/postcss-purgecss cssnano

## 根目录创建 postcss.config.js（或 .postcssrc.js）

- postcss.config.js

```js
const tailwindcss = require("tailwindcss");
const purgecss = require("@fullhuman/postcss-purgecss");

class TailwindExtractor {
  static extract(content) {
    return content.match(/[A-z0-9-:/]+/g);
  }
}

module.exports = {
  plugins: [
    tailwindcss("./tailwind.config.js"),
    require("autoprefixer"),
    require("cssnano")({ preset: "default" }),
    process.env.NODE_ENV === "production" &&
      purgecss({
        content: [
          "**/*.html",
          "./src/**/*.ts",
          "./src/*.ts",
          "./src/*.tsx",
          "./src/**/*.tsx",
        ],
        css: ["./src/**/*.css"],
        extractors: [
          {
            extractor: new TailwindExtractor(),
            // Specify the file extensions to include when scanning
            extensions: ["html", "ts", "tsx", "css"],
          },
        ],
      }),
  ],
};
```

- 说明

* autoprefixer css 规范化 hack 兼容， 参数配置语法：

**postcss.config.js**

```js
plugins: [require("autoprefixer")({ browsers: "last 2 versions" })];
```

OR

**postcss.config.js**

```js
plugins: [require("autoprefixer")];
```

**package.json**

```json
"browserslist": [
  "> 1%", // 全球浏览器使用率大于1%
  "last 2 versions" // 每个浏览器中最新的两个版本
]
```
其他的一些参数简单介绍：

ie 6-8: 选择包含ie6-8的版本。
Firefox > 20: 火狐版本号大于20。

* cssnano
  
一定要在autoprefixer之后，否则autoprefixer可能会失效

* 更多 https://github.com/whidy/postcss-study/blob/master/PostCSS%E5%AD%A6%E4%B9%A0%E6%8C%87%E5%8D%972.md

## 生成tailwind配置文件

> npx tailwindcss init

* taiwindcss.config.js
```js
module.exports = {
  purge:  {
    enabled: true,
    content: [
      './public/*.html',
      './src/*.tsx',
      './src/**/*.tsx'
    ],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
```
更多配置项 https://docs.tailwindchina.com/docs/configuration

## 创建css配置文件并引入生效

- src
  - css
    - style.css
    - output.css

* style.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

* output.css

```css
import './css/output.css'
```

* index.tsx

```tsx
import './css/output.css'
```

## 配置项目打包命令

> yarn add --dev postcss-cli concurrently

修改script命令

```json
"scripts": {
    "start": "webpack serve --config build/webpack.dev.config.js --open",
    "dev": "concurrently \"yarn watch:css \" \"yarn start \"",
    "build": "yarn build:css && yarn build:prod",
    "build:prod": "npx webpack --config build/webpack.prod.config.js",
    "build:css": "postcss src/css/styles.css -o src/css/output.css",
    "watch:css": "postcss src/css/styles.css -o src/css/output.css -w",
}
```

** 在开发环境下，最好使用 yarn dev 命令来进行开发，支持代码热替换和 tailwindcss 的热更新。正式打包则是使用 yarn build 命令来进行打包。

# 优化

## 代码分析报告

- 相关依赖 -- webpack-bundle-analyzer

> yarn add --dev webpack-bundle-analyzer

* webpack.dev.config.js

const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
```js
module.exports = merge(baseConfig, {
    //...
    plugins: [
      ...baseConfig.plugins,
      new BundleAnalyzerPlugin()
    ],
})
```