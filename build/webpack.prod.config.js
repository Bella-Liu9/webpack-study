const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.base.config");

module.exports = merge(baseConfig, {
  mode: "production",
  cache: {
    type: "filesystem", // 触发buildDependencies
    buildDependencies: {
      config: [__filename], // 定义缓存路径
    },
  },
});
