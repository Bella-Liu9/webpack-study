const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
// 获取根文件
const rootDir = process.cwd();

module.exports = {
  entry: path.resolve(rootDir, "src/index.js"),
  output: {
    path: path.resolve(rootDir, "dist"),
    filename: "bundle.[contenthash:8].js",
  },
  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
        use: "babel-loader",
        include: path.resolve(rootDir, "src"),
        exclude: /node_modules/,
      },
      {
        test: /\.(sass|scss|css)$/i,
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
        ],
      },
      {
        test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
        type: "asset",
      },
    ],
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
};
