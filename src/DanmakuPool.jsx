import { createEffect, onMount, splitProps } from "solid-js";
import { DANMAKU_POOL_ELEMENT_ID } from "./constant";
import { createRefValue, DanmakuInjector } from "./utils";

export const DanmakuPool = (props) => {
  const [local, other] = splitProps(props, [
    'ref',
    'rootRef',
    'videoRef',
    'comments',
    'danmakuInjectorRef',
  ]);
  const comments = () => local.comments;
  const [danmakuInjector] = createRefValue(new DanmakuInjector({
    rootRef: local.rootRef,
    videoRef: local.videoRef,
  }));

  createEffect(function onCommentsUpdate() {
    console.info('[createEffect] onCommentsUpdate invoked');
    if (!comments() || !comments().length) {
      console.warn('Invalid comments value:', comments());
      return;
    }

    danmakuInjector().comments(comments());
  });

  onMount(() => {
    local.danmakuInjectorRef?.(danmakuInjector());
  });

  return (
    <div id={DANMAKU_POOL_ELEMENT_ID}
      ref={local.ref}
      className={`
        absolute top-0 bottom-0 left-0 w-full z-1001 overflow-hidden pointer-events-none
        ${props.className || ''}
      `}
      {...other}
    />
  );
};
