import { createMemo, createSignal } from "solid-js";
import { ControlBar } from "../ControlBar";
import { createRefValue, DanmakuInjector, xmlDanmakuToJson } from "../utils";
import { DanmakuOperateType, DanmakuSource, FULLSCREEN_CHANGE_EVENTS, SINGLE_DANMAKU_STYLE, VIDEO_TIME_SLOT_UNIT } from "../constant";
import { requestVqqBatchDanmaku } from "./request";
import { IconRadiusButton } from "../Component/Button";
import { CollapseIcon } from "../Component/Svg";

/**
 * 弹幕融合播放器组件 Props 类型
 * @typedef {Object} DanmakuFusionProps
 * 
 * @property {HTMLDivElement} rootRef - 弹幕根容器引用（必需）
 * @property {HTMLVideoElement} videoRef - 视频元素引用（必需）
 * @property {Boolean} showCollapseBtn - 是否展示 Collapse Button（可选）
 * @property {Function} onClickCollapseBtn - 点击 Collapse Button 时触发
 * 
 * 弹幕融合播放器组件
 * @param {DanmakuFusionProps} props
 */
export const DanmakuFusion = (props) => {
  const [danmakuOperationEnable, setdanmakuOperationEnable] = createSignal(false);
  const [vid, setVid] = createRefValue('');
  const [timeCount, setTimeCount] = createRefValue(-1);
  const [getZenCursorTimer, setZenCursorTimer] = createRefValue(0);
  const [danmakuInjector] = createRefValue(new DanmakuInjector({
    rootRef: props.rootRef,
    videoRef: props.videoRef,
  }));

  const zenCursorMousemoveHandler = createMemo(() => function() {
    getZenCursorTimer() && clearTimeout(getZenCursorTimer());

    const cssText = props.rootRef.style?.cssText || '';
    if (!getZenCursorTimer() && cssText.includes('cursor: none')) {
      console.info('recover cursor')
      props.rootRef.style = "cursor: auto;";
    }

    if (!document.fullscreenElement) {
      return;
    }

    const timer = setTimeout(() => {
      if (props.videoRef.paused) {
        console.info('video pause, so do not hide cursor')
        return;
      }
      console.info('cursor hide');
      props.rootRef.style = "cursor: none !important;";
      setZenCursorTimer(0);
    }, 1000);
    setZenCursorTimer(timer);
  });

  const addZenCursorMousemoveListener = () => {
    document.addEventListener('mousemove', zenCursorMousemoveHandler());
  };

  const removeZenCursorMousemoveListener = () => {
    document.removeEventListener('mousemove', zenCursorMousemoveHandler());
  };

  const fullscreenChangeHandler = createMemo(() => function() {
    setTimeout(() => {
      danmakuInjector().resize();
    }, 200);

    if (document.fullscreenElement) {
      addZenCursorMousemoveListener();
    } else {
      clearTimeout(getZenCursorTimer());
      removeZenCursorMousemoveListener();
      props.rootRef.style = "cursor: auto;";
      console.info('removeEventListener zenCursor');
    }
  });

  const addFullscreenchangeListener = () => {
    FULLSCREEN_CHANGE_EVENTS.forEach(eventName => {
      document.addEventListener(eventName, fullscreenChangeHandler(), false);
    });
  };

  const danmakuComments = (comments) => {
    danmakuInjector().comments(comments);

    setdanmakuOperationEnable(true);
    addFullscreenchangeListener();
  };

  const timeupdateHandler = createMemo(() => async function() {
    const currentTime = Number.parseInt(this.currentTime);
    const curTimeCount = Number.parseInt(currentTime / VIDEO_TIME_SLOT_UNIT);
    if (curTimeCount !== timeCount()) {
      setTimeCount(curTimeCount);
      const comments = await requestVqqBatchDanmaku(vid(), curTimeCount);
      danmakuComments(comments);
    }
  });
  
  const removeTimeupdateListener = () => props.videoRef.removeEventListener('timeupdate', timeupdateHandler());

  const addTimeupdateListener = () => {
    removeTimeupdateListener();
    props.videoRef.addEventListener('timeupdate', timeupdateHandler());
  };

  const consumeBilibiliDanmaku = (xmlText) => {
    console.info('consumeBilibiliDanmaku invoked');
    const { danmaku = [] } = xmlDanmakuToJson(xmlText);
    const comments = danmaku.map(item => ({
      text: item.content,
      time: item.time,
      style: {
        ...SINGLE_DANMAKU_STYLE,
        color: item.color,
        // fontSize: `${item.fontSize}px`,
      }
    }));

    danmakuComments(comments);
  };

  const applyDanmakuConf = (danmakuSource, rest) => {
    switch(danmakuSource) {
      case DanmakuSource.Bilibili:
        removeTimeupdateListener(); // if exist!
        consumeBilibiliDanmaku(rest.xmlText);
        break;
      case DanmakuSource.Vqq:
        setVid(rest.vid);
        addTimeupdateListener();
        break;
      default:
        console.warn(`Unexcept DanmakuSource type, current is ${danmakuSource || '<empty string>'}`);
    }
  };

  const onClickDanmakuOperate = (type, rest) => {
    switch (type) {
      case DanmakuOperateType.Resize:
        danmakuInjector().resize();
        break;
      case DanmakuOperateType.Hide:
        danmakuInjector().hide();
        break;
      case DanmakuOperateType.Show:
        danmakuInjector().show();
        break;
      case DanmakuOperateType.FontSize:
        danmakuInjector().setFontSize(rest.fontSize);
        break;
      case DanmakuOperateType.Opacity:
        danmakuInjector().setOpacity(rest.opacity);
        break;
      default:
        console.warn(`Unexcept DanmakuOperateType, current is ${type}`);
    }
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      props.rootRef.requestFullscreen();
    }

    setTimeout(() => {
      danmakuInjector().resize();
    }, 200);
  };

  return (
    <ControlBar
      danmakuOperationEnable={danmakuOperationEnable()}
      onClickApplyDanmakuSrc={applyDanmakuConf}
      onClickToggleFullscreen={toggleFullscreen}
      onClickDanmakuOperate={onClickDanmakuOperate}
    >
      {props.showCollapseBtn ? (
        <IconRadiusButton className="ml-3 mr-2" onClick={() => {
          props.videoRef.pause();
          props.onClickCollapseBtn();
        }}><CollapseIcon /></IconRadiusButton>
      ) : (<></>)}
    </ControlBar>
  );
};
