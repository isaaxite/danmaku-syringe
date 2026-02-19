
# 前言

package.json 中 script 命令，可使用 ntl 交互式执行。

```shell
npx ntl
```

# 运行环境

node 版本：主要在 `v20.19.6` 版本下做开发，其次是 `v18.20.8`。并非仅这两个版本可用，其他或可，只是未尝试。

# 项目依赖安装

使用 `pnpm` 作为 `npm` 包管理工具。`pnpm` 版本： `10.17.1`。

在依赖安装前先确实已经安装 `pnpm`：

```shell
pnpm -v
```

依赖安装

```shell
pnpm install
```

# 核心依赖

技术栈构成：`solid-js`、`tailwindcss` 和 `danmaku`。

- `solid-js`：类似 `react` 的前端框架，但更轻量级；
- `tailwindcss`：样式库，原子级别。作为实验性工具被选用，未来考虑替换更优的；
- `danmaku`：核心。弹幕渲染库。

实际使用的版本：

- `danmaku：2.0.9`，文档：https://github.com/weizhenye/Danmaku； Demo 体验：https://danmaku.js.org/；
- `tailwindcss：4.1.18`；文档：https://tailwindcss.com；
- `solid-js：1.9.11`，文档：https://solidjs.com。


# 运行以开发

```shell
npm run dev
```

成功运行后可在浏览器访问：`localhost:8000/`，进行开发调试（支持热更新）。

# 业务代码目录结构

```shell
$ tree
.
├── ...
├── index.jsx
├── ...
├── src
│   ├── App.jsx
│   ├── Component/
│   ├── constant.js
│   ├── ControlBar.jsx
│   ├── DanmakuFusion
│   │   ├── index.jsx
│   │   ├── render.jsx
│   │   └── request.js
│   ├── EntryBar
│   │   ├── index.jsx
│   │   ├── Logic.jsx
│   │   └── View.jsx
│   ├── style.css
│   ├── utils.js
│   └── VideoContainer.jsx
└── ...
```

- `index.jsx` 是入口文件，负责渲染次入口（`App.jsx`）；
- `App.jsx` 由 `EntryBar` 组件构成，上屏的初见页面；
- `EntryBar` 按需渲染 `DanmakuFusion` 组件；
- `DanmakuFusion` 由 `ControlBar` 和 `VideoContainer` 组成。

# 开发调试

执行 `npm run dev`，除了打包业务代码外，还会另外打包 `dev/` 目录下代码以调试业务代码，及业务代码中使用到的组件。

```shell
├── asset/ # 调试用到的资源
├── dist  # npm run dev 构建的产物
│   ├── byproduct.js  # dev/ 代码的构建产物
│   ├── byproduct.js.map
│   ├── index.js  # 业务代码构建产物
│   └── index.js.map
├── index.html  # localhost:8000/ 访问的页面，分别引入了 byproduct.js 和 index.js
├── index.jsx # 入口文件，使用 solidjs 的路由组件分发 dev/src/ 下的页面
└── src # 除了 Component/ 外，其余每个组件对应一个页面，index.html 中可通过哈希路由访问
    ├── Button.jsx
    ├── Component
    │   └── index.jsx
    ├── ControlBar.jsx
    ├── DanmakuFusion.jsx
    ├── EntryBar.jsx
    ├── Home.jsx
    ├── HoverBlock.jsx
    ├── Icon.jsx
    ├── Input.jsx
    ├── Select.jsx
    ├── Textarea.jsx
    └── TopDrawer.jsx
```

# 分支规范

核心分支：`main`

开发分支：`<type>/xxx`，`type` 沿用 Angular 规范的 `type`，详细见 Commit 规范章节。

# Commit 规范

使用 Angular 规范。Angular 规范要求每个 commit message 都包含三个部分：Header、Body 和 Footer。其中，Header 包含一个必填字段和一个可选字段，必填字段为 Type，可选字段为 Scope。Body 和 Footer 都是可选的，用于提供更详细的信息。

**Angular 规范的格式为：**

```shell
<type>[(scope)]: <subject>

[body]

[footer]

# e.g.
# slim
feat: add user management module

# fully
feat(users): add user management module

This commit adds the user management module to the project.

Closes #123
```
其中，`<type>` 表示 commit 的类型，`[scope]` 表示 commit 的影响范围，`<subject>` 表示 commit 的简短描述，`[body]` 表示 commit 的详细描述，`<footer>` 表示 commit 的元信息，如关闭 issue、引入变更等。

**Type 字段包含以下值：**

- `feat`：新功能
- `fix`：修复问题
- `docs`：文档修改
- `style`：代码格式修改，不影响代码逻辑
- `refactor`：重构代码，既不修复错误也不添加功能
- `perf`：性能优化
- `test`：添加或修改测试代码
- `build`：构建系统或外部依赖项修改
- `ci`：持续集成修改
- `chore`：其他修改，如修改构建流程或辅助工具等
- `revert`：回滚到之前的提交

# 生产环境调试

当前开发的版本是针对油猴脚本可能性。对此， 2 个点需要关注：

1. 如何构建生产包；
2. 如何对当前生产包做油猴脚本的匹配性修改；

## 生产包构建

```shell
npm run pord
```

产物位置是 `./dist/index.js`。

## 匹配性修改

修改 `esbuild.config.js` 的内容。

```js
const DEF_MATCH_LIST = [
  'https://danmu.yhdmjx.com/m3u8.php?*',
  'https://player.cycanime.com/?*',
  'https://art.v2player.top:8989/player/?*'
];
```
以上三个匹配地址非直接访问的视频网站，而是它们内嵌的 `iframe` 地址，下面是各自对应关系：

- `https://art.v2player.top:8989/player/?*` -> [omofun动漫](https://www.omofuna.com)
- `https://player.cycanime.com/?*` -> [次元城动画](https://www.cycani.org/)
- `https://danmu.yhdmjx.com/m3u8.php?*` -> 不清楚，可能是 [NT动漫](https://ntdm8.com/)。它目前已经失效。
