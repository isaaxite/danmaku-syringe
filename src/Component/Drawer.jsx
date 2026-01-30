// MinimalTopDrawer.jsx
import { Show, children } from 'solid-js';

export function TopDrawer(props) {
  const resolvedChildren = children(() => props.children);
  
  // 默认启用关闭按钮
  const showCloseButton = props.showCloseButton !== false;

  // 遮罩点击关闭
  const handleBackdropClick = () => {
    if (props.onBackdropClick) {
      props.onBackdropClick();
    }
  };
  
  // 关闭按钮点击
  const handleCloseClick = (e) => {
    e.stopPropagation();
    if (props.onClose) {
      props.onClose();
    } else if (props.onBackdropClick) {
      // 如果没有单独的 onClose，则使用 onBackdropClick
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
          ${props.className || ''}
        `}
        style={{
          height: props.height || 'auto',
          maxHeight: props.maxHeight || '80vh',
          ...props.style,
        }}
        onClick={handleDrawerClick}
      >
        {/* 右上角关闭按钮 */}
        <Show when={showCloseButton}>
          <button
            type="button"
            onClick={handleCloseClick}
            class="absolute right-3 top-3 z-10
                   p-1.5 rounded-full
                   text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200
                   hover:bg-gray-100 dark:hover:bg-gray-700
                   transition-colors duration-200"
            aria-label="关闭抽屉"
          >
            {/* 关闭图标 - X */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </Show>

        {/* 内容区域 */}
        <div class="h-full overflow-y-auto p-0">
          {resolvedChildren()}
        </div>
      </div>
    </>
  );
}
