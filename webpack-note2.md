# 支持 TS

- 项目依赖 -- typescript

> yarn add --dev typescript

## 初始化 tsc

> tsc --init

-> 根目录生成 tsconfig.json

```json
{
  "compilerOptions": {
    "outDir": "./dist/",
    "sourceMap": true,
    "noImplicitAny": true,
    "module": "es6",
    "target": "es5",
    "jsx": "react",
    "allowJs": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true
  },
  "exclude": ["node_modules", "dist"],
  "types": ["typePatches"]
}
```

- 对于未定义 types 文件类型报错
  在根目录创建 '\*\*\*.d.ts'

```ts
declare module "*.png" {
  const content: any;
  export default content;
}
```

## 引入 ts-loader

- 所需依赖 -- ts-loader

> yarn add --dev ts-loader

### 配置 webpack

```js
module: {
    rules: [{
        test: /.(ts|tsx)$/,    // 因为之后要适配 react，所以这里提前写入 tsx
        use: [
          {
            loader: 'thread-loader',
            options: {
            }
          },
          'babel-loader',
          {
            loader: 'ts-loader',
            options: {
              happyPackMode: true,
              transpileOnly: true
            }
          }
        ],
        exclude: /node_modules/,
    },
        //...
    ]
},
resolve: {
  extensions: ['.tsx', '.ts', '.js'], // 定义解析顺序
},
```

- resolve extensions 说明

尝试按顺序解析这些扩展。如果多个文件共享相同的名称但具有不同的扩展名，webpack 将使用数组中第一个列出的扩展名解析文件并跳过其余文件。

# 支持 React

- 项目依赖 -- react react-dom

> yarn add react react-dom

> yarn add --dev @types/react @types/react-dom

- 将 index.js 改为 index.tsx 并用 react 写入

* 注

1. 同时修改 webpack 中关于 index.js 的相关路径， 比如 "entry" 和 package.json 的 "main"
2. 同时修改 public/index.html 在 body 中添加 div#root

# babel 支持 react 和 懒加载(react.lazy()&Suspend)

- 所需依赖 -- @babel/plugin-syntax-dynamic-import @babel/preset-react

> yarn add --dev @babel/plugin-syntax-dynamic-import @babel/preset-react

- .babelrc

```json
{
  "presets": [
    ["@babel/preset-env"],
    // 新增
    ["@babel/preset-react", { "targets": { "node": "current" } }]
  ],
  "plugins": [
    ["@babel/plugin-transform-runtime", { "corejs": 3 }],
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ["@babel/plugin-proposal-class-properties", { "loose": true }],
    ["@babel/plugin-proposal-private-methods", { "loose": true }],
    // 新增
    ["@babel/plugin-syntax-dynamic-import"]
  ]
}
```

- 为什么要让 babel 支持 react
  https://segmentfault.com/a/1190000022415711
