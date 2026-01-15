# 前言

1. 浏览器插件；
   1. 打包输出多个文件入口；

2. 油猴插件；
   1. 打包输出单个 js 文件；


油猴插件开发先行，原因是易于测试发行版本功能；

# 使用 esbuild

需要根据目标至少有 4 个版本的配置：浏览器插件、油猴分别的 development 和 productment


# 引入 solidjs


# 引入 tailwindcss

打包到单个 js 包（油猴）：

使用 esbuild-tailwindcss 插件 + tailwindcss 配置文件。

以下是待实践的配置

```js
// esbuild.config.js
import esbuild from 'esbuild'
import { tailwindPlugin } from 'esbuild-tailwindcss'

esbuild.build({
  entryPoints: ['src/main.js'],
  bundle: true,
  outfile: 'dist/bundle.js',
  plugins: [
    tailwindPlugin({
      // 可选：指定 tailwind.config.js 路径
      config: './tailwind.config.js'
    })
  ],
  loader: {
    '.css': 'css',
  },
}).catch(() => process.exit(1))
```

安装 tailwindcss

```shell
pnpm add -D tailwindcss
```

安装 esbuild-tailwindcss 插件

```shell
pnpm add -D esbuild-tailwindcss
```

新增 tailwindcss 配置文件（`./tailwindcss.config.js`），

下面是参考的配置内容（由 tailwindcss 提供的 cli 初始化——`npx tailwindcss init`）：

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
    // 添加其他文件路径
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

实践使用 `tailwindcss` CLI 初始化配置时出现以下错误：

```shell
# isaac @ LMDE in ~/Workspace/danmaku-migrate on git:branch/env x [3:07:01] C:1
$ npx tailwindcss init
npm error could not determine executable to run
npm error A complete log of this run can be found in: /home/isaac/.npm/_logs/2026-01-15T19_07_25_952Z-debug-0.log
```

尝试安装 `@tailwindcss/cli`。无效，它无此功能。手动创建配置文件并应用以上配置内容。

更新 esbuild 配置

当前配置（`./scripts/build.js`）:

```js
const { build, context } = require("esbuild");
const { solidPlugin } = require("esbuild-plugin-solid");
const isProduction = process.env.NODE_ENV !== 'development';

const opt = {
  entryPoints: ['./index.jsx'],
  bundle: true,
  // target: ['chrome58', 'firefox57', 'edge16'],
  outfile: 'dist/index.js',
  plugins: [solidPlugin()],
  minify: isProduction,
  sourcemap: !isProduction,
  define: {
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
  },
  conditions: [process.env.NODE_ENV],
};
// build(opt);

(async function main() {
  const ctx = await context(opt);
  const { hosts, port } = await ctx.serve({
    servedir: './'
  });
  console.info(`> http://localhost:${port}/`)
  await ctx.watch();
})();

```
