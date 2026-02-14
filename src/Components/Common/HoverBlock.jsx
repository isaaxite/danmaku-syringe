import { createSignal, onCleanup, createEffect, splitProps } from 'solid-js';

export const HoverBlock = (props) => {
  const [local, other] = splitProps(props, [
    'forceVisible',
    'className',
    'children',
    'onMouseEnter',
  ]);
  const [isHovered, setIsHovered] = createSignal(false);
  const [isVisible, setIsVisible] = createSignal(false);
  let hoverTimeout;

  const handleMouseEnter = () => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setIsHovered(true);
    setIsVisible(true);

    local.onMouseEnter && local.onMouseEnter();
  };

  const handleMouseLeave = () => {
    // 如果外部强制显示，不处理鼠标离开
    if (local.forceVisible) return;
    
    setIsHovered(false);
    setIsVisible(false);
  };

  // 监听外部强制显示属性的变化
  createEffect(() => {
    if (local.forceVisible) {
      // 强制显示，清除所有状态
      if (hoverTimeout) clearTimeout(hoverTimeout);
      setIsVisible(true);
      // 保持悬停状态为false，因为这是强制显示，不是悬停
      setIsHovered(false);
    } else if (!isHovered()) {
      // 取消强制显示且不是悬停状态，则隐藏
      setIsVisible(false);
    }
  });

  onCleanup(() => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
  });

  return (
    <div
      class={`
        transition-opacity duration-300
        ${isVisible() || local.forceVisible ? 'opacity-100' : 'delay-700 opacity-0'}
        ${local.className || ''}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...other}
    >
      {local.children}
    </div>
  );
};
