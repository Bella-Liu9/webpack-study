const tailwindcss = require("tailwindcss");
const purgecss = require("@fullhuman/postcss-purgecss"); // 清除

class TailwindExtractor {
  static extract(content) {
    return content.match(/[A-Za-z0-9:/]/g);
  }
}

module.exports = {
  plugins: [
    tailwindcss("./tailwind.config.js"),
    require("autoprefixer"), // 兼容
    require("cssnano")({ preset: "default" }), // css缩减器
    process.env.NODE_ENV === "production" &&
      // 仅在生产环境
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
            extentions: ["html", "ts", "tsx", "css"],
          },
        ],
      }),
  ],
};
