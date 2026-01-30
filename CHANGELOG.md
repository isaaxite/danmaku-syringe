# 前言

油猴脚本开发文档：https://www.tampermonkey.net/documentation.php

当前这个项目使用 esbuild 打包，输出的包有以下两种类型：

1. 浏览器插件；
   1. 打包输出多个文件入口；

2. 油猴插件；
   1. 打包输出单个 js 文件；

以下是油猴脚本的”外壳“，显然它是 `IIFE` 风格的。在脚本中，顶部的注释是具备含义的，它可以使用 esbuild 的第一层配置 [`.banner`](https://esbuild.org.cn/api/#banner)进行插入。

```js
// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2026-01-17
// @description  try to take over the world!
// @author       You
// @match        https://esbuild.github.io/api/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.io
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();
```

可以预见的 2 个esbuild 配置：

```js
import * as esbuild from 'esbuild'

const comment = `// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2026-01-17
// @description  try to take over the world!
// @author       You
// @match        https://esbuild.github.io/api/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.io
// @grant        none
// ==/UserScript==
`;

await esbuild.build({
  entryPoints: ['app.js'],
  banner: {
    js: comment
  },
  format: 'iife',
  outfile: 'out.js',
})
```


油猴插件开发先行，原因是易于测试发行版本功能；

# 使用 esbuild

    打包 - 将多个文件打包成一个或多个 bundle

    压缩 - JavaScript、CSS 的极速压缩

    转换 - 支持 TypeScript、JSX、TSX

    代码分割 - 支持动态导入和代码分割

    Tree shaking - 自动删除未使用代码

> 默认情况下，esbuild 的打包器配置为生成针对浏览器的代码。

需要根据目标至少有 4 个版本的配置：浏览器插件、油猴分别的 development 和 productment

## 开发模式的搭建

1. 监听文件变动，自动构建；
2. 启动服务，是浏览器可访问；
3. 热更新，自动构建后自动踹新浏览器；

以上三点都在 https://esbuild.org.cn/api/#live-reload 中得到说明，实现方式简单：

- 1、2 使用 `esbuild.context` api 的 `watch` 和 `serve` 方法；
- 在访问的 html 页面中添加 js 代码： `new EventSource('/esbuild').addEventListener('change', () => location.reload())`，监听事件触发刷新。 


## esbuild 插件的生命周期

插件在 esbuild 配置文件中的下面位置添加：

```js
const opt = {
  entryPoints: ['./index.jsx'],
  bundle: true,
  outfile: 'dist/index.js',
  plugins: [
    solidPlugin(),
    cssInlinePlugin,
  ],
  // ...
};
```

插件有第三方（npm 或 github）和自己手写。两者生命周期中的钩子（callback）都一样，下面针对手写的展开。

钩子由 `setup` 方法的第一个入参 `build` 的 4 个方法组成：

1. `build.onStart`；
2. `build.onEnd`；
3. `build.onResolve`；
4. `build.onLoad`。

其中 `build.onResolve` 和 `build.onLoad` 重点关注。


- `build.onResolve` 控制项目中引入的路径（`import`、`require`）如何解析（参考文档中的 https://esbuild.org.cn/plugins/#resolve），或改变其路径；
- `build.onLoad` 控制的是，路径解析完后的内容。

当前项目将 `tailwindcss` 注入到输出的 js 文件中，这个效果就是手写插件的 `build.onLoad` 起到作用。

### 在构建过程中，根据什么判定执行这个 `onLoad` 插件的逻辑？

esbuild 构建过程中，在分析导入语句（`import xx` 或 `require(xx)`），应该都会进行判断是否执行插件。

```js
build.onLoad({ filter: /\.css$/ }, async (args) => {
  // ...
}
```

> [filter](https://esbuild.github.io/plugins/#on-load-options)
>
> Every callback must provide a filter, which is a regular expression. The registered callback will be skipped when the path doesn't match this filter. You can read more about filters [here](https://esbuild.github.io/plugins/#filters). 

判断是否执行的条件是 filter，即 `filter: /\.css$/`。正则匹配导入语句中的路径是否包含 `.css` 后缀。


回调函数中的 content 和 loader


loader 是什么？

loader 不但在此处 `return` 出现，更平常在第一层配置中：

```js
const opt = {
  entryPoints: ['./index.jsx'],
  bundle: true,
  outfile: 'dist/index.js',
  // ...
  loader: {
    '.js': 'jsx',
    '.jsx': 'jsx',
  },
  // ...
```

loader 告诉 esbuild 何种文件（根据文件扩展名）将被解析（转化）为何种类型的内容。


1. 默认的 loader 有哪些？

# 引入 solidjs


# 引入 tailwindcss

打包到单个 js 包（油猴）：

- [ ] 使用 esbuild-plugin-tailwindcss 插件 + tailwindcss 配置文件；
- [x] 使用 postcss + 手写 esbuild 插件。

## 使用 esbuild-plugin-tailwindcss 插件 + tailwindcss 配置文件。

*当前实践过后，选择器用。单纯插件无法让 tailwindcss 注入到产物（唯一的 js 文件）中间中*

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

## 使用 postcss + 手写 esbuild 插件

*此为最后选择使用的方案*

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


# 我看见 2 个网站。都是 html 里嵌入 iframe，video 在 iframe 中。这是为何？

这是一个很好的观察！**将视频放在 iframe 里嵌入主页面是一种非常常见且重要的前端架构策略**。这么做主要有以下几个核心原因：

### 1. **模块化与隔离（最重要的原因）**
   * **沙箱环境**： iframe 提供了天然的代码和样式隔离。视频播放器（尤其是第三方播放器如 Vimeo Pro、Wistia、Brightcove 或自定义播放器）通常是一个功能复杂的独立应用。放在 iframe 里可以：
     * **避免 CSS 污染**： 防止主站样式意外影响播放器按钮、控制栏的布局和外观。
     * **避免 JavaScript 冲突**： 防止主站的 JS 库（如 jQuery、React 等）与播放器自身的 JS 发生冲突。
     * **保证稳定性**： 即使主站某个脚本出错，iframe 内的播放器通常仍能正常工作。

### 2. **安全性与跨域控制**
   * **内容安全策略**： 如果视频来自第三方平台或 CDN，iframe 是更安全的方式。主站可以控制 iframe 的权限（通过 `sandbox` 属性），例如禁止其执行脚本、提交表单或访问父页面 Cookie。
   * **跨域通信可控**： 通过 `postMessage` API，主站和 iframe 内的视频播放器可以进行安全的、受控的通信（如播放/暂停、获取当前时间、全屏控制等），同时又保持了清晰的边界。

### 3. **性能优化与懒加载**
   * **独立加载和缓存**： 视频播放器（其 HTML、CSS、JS 和视频流）的加载可以与主页面的加载分离。如果用户不点击播放，播放器资源可以不加载或延迟加载。
   * **避免阻塞主线程**： 视频编解码、缓冲、DRM 处理等操作可能比较消耗资源。放在 iframe 中，这些任务可以在单独的进程/线程中运行，减少对主页面交互响应的影响。
   * **便于实现“画中画”模式**： 许多现代浏览器支持 iframe 级别的画中画功能，这种方式更容易实现。

### 4. **功能与商业需求**
   * **第三方专业平台集成**： Vimeo、Wistia、YouTube 等平台默认提供的嵌入代码就是 iframe。它们提供了丰富的后台功能（分析、热度图、线索收集、AB 测试），这些功能需要其播放器代码在一个可控环境中运行。
   * **灵活的广告集成**： 许多视频广告联盟（如 Google IMA）要求在 iframe 环境中运行，以确保广告的展示、跟踪和安全性。
   * **DRM（数字版权管理）**： 保护付费内容（如 Netflix、Disney+）的 DRM 系统（如 Widevine、PlayReady）对执行环境有严格要求，iframe 提供了一个更纯净、可控的环境来满足这些要求。

### 5. **代码管理与更新**
   * **独立部署**： 视频播放器团队可以独立开发、测试和部署播放器应用，只需更新 iframe 的源地址或播放器版本即可，无需触动主站代码。这符合微前端架构思想。
   * **A/B 测试**： 可以轻松地更换不同版本的播放器（指向不同的 iframe URL）进行测试。

### 技术实现对比
* **传统 `<video>` 标签直接嵌入**： 简单、直接，但播放器样式和功能受主站环境影响大，难以实现复杂功能和第三方集成。
* **`<iframe>` 嵌入播放器**： 隔离、安全、功能强大，是商业级、高要求视频网站的主流选择。你看到的两个网站很可能就是采用了这种更专业的方案。

**简单总结：** 你看到的不是简单的“一个视频文件”，而是一个**功能完整的视频播放器应用**。用 iframe 装载这个应用，就像在一个房间里放了一台独立的电视机。房间的装修（主站样式）不会改变电视机的操作界面，电视机的声音也不会轻易干扰房间的其他活动，两者通过遥控器（`postMessage`）进行清晰、可控的交互。这是一种追求**稳定性、安全性和功能完备性**的工程设计。



# solidjs JSX 父子组件，父组件如何获取自足见內 dom 节点引用

使用 refs，参考：

- 转发 refs：https://solid.yayujs.com/concepts/refs#%E8%BD%AC%E5%8F%91-refs
- Forwarding refs：https://docs.solidjs.com/concepts/refs#forwarding-refs


# 弹幕 API

## bilibili

单次获取完整弹幕。

### 请求

```shell
GET https://api.bilibili.com/x/v1/dm/list.so?oid={oid}
```

### 响应

响应的数据结构分为 xml 和 json 两种。

#### xml

数据包结构如下，其中弹幕的核心信息在 `<d>` 的 `p` 属性。

```xml
<i>
	<chatserver>chat.bilibili.com</chatserver>
	<chatid>35514027057</chatid>
	<mission>0</mission>
	<maxlimit>3000</maxlimit>
	<state>0</state>
	<real_name>0</real_name>
	<source>k-v</source>
	<d p="695.79200,1,25,16777215,1768967938,0,38e4be46,2029009147471297280,10">？时间道祖出手了是吧</d>
	<d p="129.81700,1,25,16777215,1768964234,0,d43a8a84,2028978073919204096,10">所谓丰城第一武徒，说到底不过是个淬体期</d>
	<d p="177.60400,1,25,16777215,1768963033,0,a9f32ef4,2028967994545773056,10">进度有点慢了，一点剧情不费劲，要我说，擂台比武别结束了，一直打下去得了。</d>
</i>
```

`p` 属性包含的信息如下：

```shell
{time},{mode},{fontSize},{color},{timestamp},{pool},{senderHash},{danmakuId},{rowId}
```

- time：时间（秒）；
- mode：模式（1普通，4底部，5顶部）；
- fontSize：字体大小；
- color：颜色（十进制）；
- timestamp：发送时间戳；
- pool：弹幕池；
- senderHash：发送者哈希；
- danmakuId：弹幕ID；
- rowId：行ID。

#### json

## 腾讯视频

分段（时间段，每 30s 一批）获取弹幕。

### 请求

```shell
GET https://dm.video.qq.com/barrage/segment/{vid}/t/v1/{start_ms}/{end_ms}
```

- vid: 网页链接中可得，https://v.qq.com/x/cover/mzc00200n53vkqc/{vid}.html
- start_ms / end_ms：单位是毫秒，开始、结束时间相差 30s（30000ms）

### 响应

格式： JSON

```json
{
  "barrage_list":[
    {
      "id":"76561198730097937",
      "is_op":0,
      "head_url":"",
      "time_offset":"0",
      "up_count":"41",
      "bubble_head":"",
      "bubble_level":"",
      "bubble_id":"",
      "rick_type":0,
      "content_style":"",
      "user_vip_degree":0,
      "create_time":"1751089213",
      "content":"恭迎叶天帝",
      "hot_type":0,
      "gift_info":null,
      "share_item":null,
      "vuid":"",
      "nick":"",
      "data_key":"id=76561198730097937",
      "content_score":53.502857,
      "show_weight":0,
      "track_type":0,
      "show_like_type":0,
      "report_like_score":0,
      "relate_sku_info":[]
    }
  ]
}
```


# 监听 video 时间变动，动态拉取腾讯视频弹幕

腾讯视频是分批拉取弹幕，按视频时间，每 30s 获取一次弹幕。

1. 尝试监听 video 的 progress 事件，获取当前视频时间判断是否获取新的弹幕。
2. 获取 video 的视频总时长，用于判断是否停止请求获取弹幕。或可使用 loadedmetadata 事件
   1. loadedmetadata事件的回调中的 this.duration 可得到时长（单位 s）

timeupdate 事件的 this 中包含 currentTime 和 duration

# 临时增加 axios 获取腾讯弹幕


# 批量更新弹幕尝试

1. o 按批次增加弹幕容器和实例；
2. x 基于 1 的前提下，在下次在增加批次后销毁上一批次；
3. x 使用 dmIns.emit 更新新增批次弹幕。部分有效，但丢失大部分新弹幕。这个问题可能和下面提到的 bug 有关；
4. x 仅使用 1 个 danmaku 实例，利用引用类型特点。通过数组 push 方式增加 comments 参数的数据。

发现一个弹幕丢失 bug：若有多条相同 time 的弹幕可能仅仅渲染 1 条

## 复盘

- dmIns.emit 实际是有效的。问题出在最初获取数据后计算 time， 本应除 1000 转化为秒，但误写为 100,导致弹幕被极大地延后，导致未在预期时间渲染。
- "基于 1 的前提下，在下次在增加批次后销毁上一批次"，同样也是有效的。只是上一次末尾的弹幕在未“跑完”闪烁离屏，体验不好。

## 最后的选择与优化

最后选择：按批次增加弹幕容器和实例。开始的实现是：2 个弹幕容器为队列上限，超出即出队销毁。

优化点：达到 2 个后，不再出队销毁，而是交换顺序，仅仅销毁实例，容器复用。


# 鼠标指针全屏隐藏

考虑做成单独的 npm 包，名字可选之一：`zen-cursor`

```shell
鼠标移动 → 显示指针 → 开始静默计时 → 超时 → 隐藏指针
  ↑                                        ↓
  └───────────────────鼠标再次移动───────────┘
```

快速实现

fullscreenchange 事件监听全屏动作, 在它的回调內根据 document.fullscreenElement 判断当前是否全屏. 全屏则监听 mousemove 事件,不是在移除 mousemove 事件. mousemove 事件回调內, 使用定时器(防抖逻辑)设置静默, 静默后移动指针解除静默是利用 `style.cssText.includes('cursor: none')`


# 监听视窗变化，调整弹幕区域

TODO

# 原网站样式污染 tailwindcss 样式

- [ ] 删除原网站样式；
- [ ] 增加 tailwindcss 的优先级

# 双击切换全屏

默认是 video 而不是 div (video 的父容器)切换.


# 菜单添加 input 输入视频相关id(vqq:vid, bilibili: oid)

## 解决 B 站 API 的跨域请求问题

- [ ] node 本地服务转发请求
- [ ] 上传本地弹幕

# 增加入口

目的是分离入口和控制组件

  - Entry.jsx 用于决定弹幕-视频容器的创建方式
  - DanmakuMigrate.jsx 以替身方式创建的弹幕-视频容器

## 根据入口增加 2 种类型容器

- 基于原视频先祖容器注入弹幕容器
- 新建根容器，添加 video 和 弹幕容器

# bilibili 增加把xml文本粘贴到 teatarea

目前 bilibili 的弹幕未能直接项目代码发请求获取，因为 CORS。

但 api 可能被浏览器或其他第三方工具有效请求，得到 xml 文本。直接复制-粘贴更方便。

- [x] 增加解析 xml 文本入口；
- [x] 增加 textarea 组件

# 使用真身容器的优化

a）优先使用代码去找 video 的祖先标签 A，A 符合以下条件：

1. Video 元素与 A 的尺寸相同。因为 A 作为”全屏功能“的作用者。
2. 在符合 1 的前提下，尽量层级更高，减少被原页面逻辑的干扰的可能。
3. A 的层级必须在 body 以下。

原有的 input 输入容器 querySelector 路径作为补充。


# 样式的改进

- [x] input:file
- [x] input:checkbox
- [ ] 


# 增加入口翻遍测试

- 组件


# 生产配置与脚本

- esbuild 的生产配置
- packagejson 脚本


# 附录

- [esbuild 中文文档](https://esbuild.org.cn)
