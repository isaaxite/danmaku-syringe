import { createEffect, createMemo, createSignal, splitProps } from "solid-js";
import { DANMAKU_POOL_ELEMENT_ID, MAX_POOL_NUM } from "./constant";
import { generateRandomString } from "./utils";
import Danmaku from "danmaku";

function appendDanmakuWraperTo(parentRef) {
  const danmakuContainerID = `danmaku-migrate_danmaku-wraper-${generateRandomString()}`;
  const danmakuWraperRef = document.createElement('DIV');
  danmakuWraperRef.setAttribute('id', danmakuContainerID);
  danmakuWraperRef.classList = 'absolute top-20 bottom-20 left-0 w-full z-1001';
  danmakuWraperRef.style = "pointer-events: none;";
  parentRef.appendChild(danmakuWraperRef);
  return danmakuWraperRef;
};

export const DanmakuPool = (props) => {
  const [local, other] = splitProps(props, [
    'ref',
    'rootRef',
    'videoRef',
    'comments',
    'onDanmakuInsListUpdate',
  ]);
  const comments = () => local.comments;
  const getDanmakuPoolRef = createMemo(() => []);

  const onDanmakuInsListUpdate = () => {
    if (!local.onDanmakuInsListUpdate) {
      return;
    }
    const danmakuInsList = getDanmakuPoolRef().map(([danmaku]) => danmaku);
    local.onDanmakuInsListUpdate(danmakuInsList);
  };

  createEffect(function onCommentsUpdate() {
    console.info('[createEffect] onCommentsUpdate invoked');
    if (!comments() || !comments().length) {
      console.warn('Invalid comments value:', comments());
      return;
    }

    const danmakuPool = getDanmakuPoolRef();
    if (danmakuPool.length < MAX_POOL_NUM) {
      const containerRef = appendDanmakuWraperTo(local.rootRef);
      const danmaku = new Danmaku({
        container: containerRef,
        media: local.videoRef,
        comments: comments(),
      });
      danmakuPool.push([danmaku, containerRef]);
      onDanmakuInsListUpdate();
      return;
    }

    let oldDanmakuPoolItem = danmakuPool[0];
    danmakuPool[0] = danmakuPool[1];
    oldDanmakuPoolItem[0].destroy();
    oldDanmakuPoolItem[1].innerHTML = '';
    danmakuPool[1] = [
      new Danmaku({
        container: oldDanmakuPoolItem[1],
        media: local.videoRef,
        comments: comments(),
      }),
      oldDanmakuPoolItem[1],
    ];
    oldDanmakuPoolItem = null;

    onDanmakuInsListUpdate();
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
