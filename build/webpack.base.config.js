const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
// 获取根文件
const rootDir = process.cwd();

module.exports = {
  entry: path.resolve(rootDir, "src/index.ts"),
  output: {
    path: path.resolve(rootDir, "dist"),
    filename: "bundle.[contenthash:8].js",
  },
  module: {
    rules: [
      {
        test: /.(ts|tsx)$/, // 因为之后要适配 react，所以这里提前写入 tsx
        use: [
          "babel-loader",
          {
            loader: "ts-loader",
            options: {
              happyPackMode: true,
              transpileOnly: true,
            },
          },
          {
            loader: "thread-loader",
            options: {},
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(jsx|js)$/,
        use: ["babel-loader", "thread-loader"],
        include: path.resolve(rootDir, "src"),
        exclude: /node_modules/,
      },
      {
        test: /\.(s[ac]ss|css)$/i,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [["autoprefixer"]],
              },
            },
          },
          "thread-loader",
        ],
      },
      {
        test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
        type: "asset",
      },
    ],
  },
  resolve: {
    extensions: ["ts", "tsx", "js"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(rootDir, "public/index.html"),
      inject: "body",
      scriptLoading: "blocking",
    }),
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "*",
          context: path.resolve(rootDir, "public"),
          to: path.resolve(rootDir, "dist"),
          globOptions: {
            ignore: path.resolve(rootDir, "public/index.html"),
          },
        },
      ],
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: "all", // 代码分割类型：all全部模块，async异步模块，initial入口模块
    },
  },
};
