import { createSignal, onCleanup, createEffect } from 'solid-js';

export const HoverBlock = (props) => {
  const [isHovered, setIsHovered] = createSignal(false);
  const [isVisible, setIsVisible] = createSignal(false);
  let hoverTimeout;

  const handleMouseEnter = () => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setIsHovered(true);
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    // 如果外部强制显示，不处理鼠标离开
    if (props.forceVisible) return;
    
    setIsHovered(false);
    setIsVisible(false);
  };

  // 监听外部强制显示属性的变化
  createEffect(() => {
    if (props.forceVisible) {
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
        transition-opacity duration-200
        ${isVisible() || props.forceVisible ? 'opacity-100' : 'opacity-0'}
        ${props.className || ''}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {props.children}
    </div>
  );
};
