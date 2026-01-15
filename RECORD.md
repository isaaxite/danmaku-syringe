
使用 solidjs，插件菜单可以用。插入到未知页面的 video 标签的父容器，应该如何？

1. [ ] 使用 Portal 标签的 mount 特性？

但 mount 的挂载点是静态的！

```jsx
<Portal mount={document.getElementById("modal")}>
  <div>My Content</div>
</Portal>
```

2. [ ] 引入执行后插入？

假设引入的是 ComfirmBlock 组件，不确定是否可行？！

```js
import ComfirmBlock from "src/ComfirmBlock"


VideoContainer.appChild(ComfirmBlock());
```

3. [x] 使用 render 函数
  
[参考](https://solid.yayujs.com/reference/rendering/render)

```js
import { render } from 'solid-js/web';

// 动态插入组件
function mountComponent(component, targetSelector) {
  const container = document.querySelector(targetSelector);
  if (!container) return null;
  
  // 清理已有内容（可选）
  container.innerHTML = '';
  
  // 渲染到指定容器
  return render(() => component, container);
}

// 使用示例
const MyComponent = () => <div>动态插入的组件</div>;

// 运行时决定插入位置
const target = '#dynamic-container'; // 可以是动态获取的
mountComponent(MyComponent, target);
```
