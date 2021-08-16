const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.base.config");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = merge(baseConfig, {
  mode: "development",
  devServer: {
    port: "8080", // 默认是 8080
    hot: true,
    stats: "errors-only", // 终端仅打印 error
    compress: true, // 是否启用 gzip 压缩
  },
  cache: {
    type: "memory", // 相当于true
  },
  plugins: [...baseConfig.plugins, new BundleAnalyzerPlugin()],
});
