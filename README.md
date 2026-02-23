**danmaku-syringe** 是可在第三方视频网站注入弹幕的脚本，部分支持实时弹幕，完全支持离线弹幕。目前以油猴脚本方向开发，未来计划发布于 Firefox 插件市场与油猴脚本市场。

# 安装

务必确认 [Tampermonkey](https://www.tampermonkey.net/index.php?locale=zh) 已被安装：

- [Tampermonkey – Get this Extension for Firefox (en-US)](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
- [Tampermonkey - Chrome Web Store](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
- [Tampermonkey - Microsoft Edge Addons](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)


然后，[点击这里](https://github.com/isaaxite/danmaku-syringe/releases/download/v1.0.0/danmaku-syringe-1.0.0.user.js)安装 danmaku-syringe。

# 脚本使用

## 匹配网站设置

编辑（或添加）脚本顶部信息中的 `@match`：

```js
// @match *://*/*
// @match https://*/*
// @match http://*/foo*
// @match https://*.tampermonkey.net/foo*bar
```

`@match` 的详细设置，参考 [Tampermonkey / 文档 / @match](https://www.tampermonkey.net/documentation.php?ext=fire&version=5.4.1&locale=zh#meta:match)


## 使用

1. 点击 `注入` 按钮，将在原有视频标签祖先容器下插入弹幕容器；
2. 点击 `弹幕源配置` 按钮；
3. `单选菜单`，选择当前视频来源，然后进行相应设置；
4. 配置完毕，点击 `应用` 按钮，即可完成弹幕的注入。

特别说明：

- 若执行步骤 1 后，效果不理想。可执行步骤 1 的注入前，选择 `替身容器`。

### 弹幕源配置项说明

Q：如何获取 vid？

A：如 `https://v.qq.com/x/cover/mzc00200xxpsogl/j4101ouc4ve.html`，其中 `j4101ouc4ve` 即是 vid。

Q：如何获取 oid？

A：浏览器开发工具，查看原视频网站的网络请求。如 https://www.bilibili.com/bangumi/play/ep2771625?from_spmid=666.25.episode.0 的页面请求中的 `GET
	https://api.bilibili.com/x/v2/dm/web/view?type=1&oid=36002858296&pid=116055670260233&duration=180&context_ext={"video_type":2}&cur_production_type=0` 。

Q：如何获取离线弹幕文件？

A：搜索引擎和语言大模型会告知。

*特别说明：使用 vid 获取的是实时弹幕，每 30s 重新获取。*
