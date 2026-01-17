# 前言

1. 浏览器插件；
   1. 打包输出多个文件入口；

2. 油猴插件；
   1. 打包输出单个 js 文件；


油猴插件开发先行，原因是易于测试发行版本功能；

# 使用 esbuild

> 默认情况下，esbuild 的打包器配置为生成针对浏览器的代码。

需要根据目标至少有 4 个版本的配置：浏览器插件、油猴分别的 development 和 productment

## 开发模式的搭建

1. 监听文件变动，自动构建；
2. 启动服务，是浏览器可访问；
3. 热更新，自动构建后自动踹新浏览器；

以上三点都在 https://esbuild.org.cn/api/#live-reload 中得到说明，实现方式简单：

- 1、2 使用 `esbuild.context` api 的 `watch` 和 `serve` 方法；
- 在访问的 html 页面中添加 js 代码： `new EventSource('/esbuild').addEventListener('change', () => location.reload())`，监听事件触发刷新。 



# 引入 solidjs


# 引入 tailwindcss

打包到单个 js 包（油猴）：

使用 esbuild-plugin-tailwindcss 插件 + tailwindcss 配置文件。

以下是待实践的配置

```js
// esbuild.config.js
import esbuild from 'esbuild'
import { tailwindPlugin } from 'esbuild-plugin-tailwindcss'

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

安装 esbuild-plugin-tailwindcss 插件

```shell
pnpm add -D esbuild-plugin-tailwindcss
```

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

更新后的配置：

1. 引入 tailwindPlugin；
2. 在插件数组中添加 tailwindPlugin 函数的调用。

```js
const { tailwindPlugin } = require("esbuild-plugin-tailwindcss");

// ...

const opt = {
  // ...
  plugins: [
    solidPlugin(),
    tailwindPlugin(),
  ],
  // ...
}
```

问题：esbuild 配置的是一个输出文件，但 css 被单独打包：

```shell
$ tree ./dist 
./dist
├── index.css
├── index.css.map
├── index.js
└── index.js.map

1 directory, 4 files
```


安装 postcss 使用后的 错误提示：

```shell
✘ [ERROR] It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin. The PostCSS plugin has moved to a separate package, so to continue using Tailwind CSS with PostCSS you'll need to install `@tailwindcss/postcss` and update your PostCSS configuration. [plugin css-inline]
```


使用 “esbuild-plugin-tailwindcss 插件 + tailwindcss 配置文件” 方法的结果不理想，换用其他。

使用 postcss + 手写 esbuild 插件

```shell
pnpm add -D postcss autoprefixer @tailwindcss/postcss
```

- `postcss`：核心功能是讲 css 转化为 AST，基于 AST 对 css 做延伸和兼容；
- `autoprefixer`：暂时不清楚是什么作用？
- `@tailwindcss/postcss`： 是和 `postcss` 更加适配的官方提供的包；

手写的 esbuild 插件（此为 claude 提供，已经测试有效）：

```js
const cssInlinePlugin = {
  name: 'css-inline',
  setup(build) {
    build.onLoad({ filter: /\.css$/ }, async (args) => {
      const css = await fs.promises.readFile(args.path, 'utf8');
      
      // 使用 PostCSS 处理 Tailwind CSS
      const result = await postcss([
        tailwindcss,
        autoprefixer,
      ]).process(css, { from: args.path });

      // 将 CSS 转换为 JS,在运行时注入到 head
      return {
        contents: `
          const style = document.createElement('style');
          style.textContent = ${JSON.stringify(result.css)};
          if (document.head) {
            document.head.appendChild(style);
          } else {
            document.addEventListener('DOMContentLoaded', () => {
              document.head.appendChild(style);
            });
          }
        `,
        loader: 'js',
      };
    });
  },
};
```

1. `({ filter: /\.css$/ }`：其中的 `filter` 是过滤什么？
2. `readFile(args.path, 'utf8')`：`args.path` 是什么的路径？tailwindcss包的？
3. 插件的生命周期
4. `setup` 函数的返回值，其中的的 `contents` 和 `loader` 都值得思考。

> contents
>
> 将其设置为字符串以指定模块的内容。如果设置了此项，则不会为该解析路径运行更多 on-load 回调。如果未设置此项，esbuild 将继续运行在当前回调之后注册的 on-load 回调。然后，如果内容仍然未设置，esbuild 将默认从文件系统加载内容（如果解析路径位于 `file` 命名空间中）。
>
> loader
>
> 这告诉 esbuild 如何解释内容。例如，js 加载器将内容解释为 JavaScript，而 css 加载器将内容解释为 CSS。如果未指定加载器，则默认加载器为 `js`。有关所有内置加载器的完整列表，请参见 内容类型 页面。

在 [esbuild 文档的插件章节](https://esbuild.org.cn/plugins/) 说明中，获得 2 个信息：

1. onResolve 控制项目中引入的路径（`import`、`require`）如何解析（参考文档中的 https://esbuild.org.cn/plugins/#resolve），或改变其路径；
2. onLoad 控制的是，路径解析完后的内容


# 迁移 esbuild 配置文件

当前位置：`./scripts/build.js`。新的目标位置：`./esbuild.config.js`。

这样会更加规范！

目前可以预见的是：1）需要修改 `packagejson` 里的 `build` 等脚本。

另外的动作：

1. 移除目前无用的两个开发依赖（即非运行时依赖）：`esbuild-plugin-tailwindcss` 和 `esbuild-style-plugin`
   1. [ x ] 删除 esbuild 配置文件中的代码；
   2. [ x ] 移除 `node_modules` 中的包。


# 附录

- [esbuild 中文文档](https://esbuild.org.cn)
