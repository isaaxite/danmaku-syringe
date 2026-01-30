// MinimalTopDrawer.jsx
import { Show, children } from 'solid-js';

export function TopDrawer(props) {
  const resolvedChildren = children(() => props.children);

  // 遮罩点击关闭
  const handleBackdropClick = () => {
    if (props.onBackdropClick) {
      props.onBackdropClick();
    }
  };

  // 抽屉内容点击阻止冒泡
  const handleDrawerClick = (e) => {
    e.stopPropagation();
  };

  return (
    <>
      {/* 遮罩层 */}
      <Show when={props.open}>
        <div
          class="fixed inset-0 z-40 bg-black opacity-25"
          onClick={handleBackdropClick}
        />
      </Show>

      {/* 抽屉主体 */}
      <div
        class={`
          fixed left-0 right-0 top-0 z-50
          bg-white dark:bg-gray-800
          shadow-lg
          transform transition-transform duration-300
          ${props.open ? 'translate-y-0' : '-translate-y-full'}
        `}
        style={{
          height: props.height || 'auto',
          maxHeight: props.maxHeight || '80vh',
          ...props.style,
        }}
        onClick={handleDrawerClick}
      >
        {/* 内容区域 */}
        <div class="h-full overflow-y-auto p-0">
          {resolvedChildren()}
        </div>
      </div>
    </>
  );
}
