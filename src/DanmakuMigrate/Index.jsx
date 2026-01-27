import { createSignal, onMount } from "solid-js";
import Controlbar from "./Controlbar"
import { BilibiliDanmakuGetterType, DanmakuSource, onDanmakuDataUpdate, setStore, store } from "./store";
import Danmaku from "danmaku";
import { generateRandomString } from "../utils";
import { DanmakuOperateType } from "../constant";
import { InlineButton } from "../Component/Button";

const MAX_POOL_NUM = 2;
const VIDEO_TIME_SLOT_UNIT = 30;  // SECOND
const SINGLE_DANMAKU_STYLE = {
  fontSize: '24px',
  color: '#ffffff',
  lineHeight: '36px',
  textShadow: '-1px -1px #000, -1px 1px #000, 1px -1px #000, 1px 1px #000'
};

function appendDanmakuWraperTo(parentRef) {
  const danmakuContainerID = `danmaku-migrate_danmaku-wraper-${generateRandomString()}`;
  const danmakuWraperRef = document.createElement('DIV');
  danmakuWraperRef.setAttribute('id', danmakuContainerID);
  danmakuWraperRef.classList = 'absolute top-20 bottom-20 left-0 w-full z-1001';
  danmakuWraperRef.style = "pointer-events: none;";
  parentRef.appendChild(danmakuWraperRef);
  return danmakuWraperRef;
};

const DanmakuMigrate = (props) => {
  const getVideoRef = () => props.videoRef;
  const getRootRef = () => props.rootRef;
  const [getContainerRef, setContainerRef] = createSignal(null);
  const [getDanmakuWraperRef] = createSignal([]);
  const [getDanmakuPoolRef] = createSignal([]);
  const getPropClassName = () => props.className;

  const getUploadedDanmakuData = () => {
    const retData = [];
    for (let i = 0; i < store.danmakuData.danmaku.length; i++) {
      const item = store.danmakuData.danmaku[i];
      retData.push({
        text: item.content,
        time: item.time,
        style: {
          ...SINGLE_DANMAKU_STYLE,
          color: item.color,
          fontSize: `${item.fontSize}px`,
        }
      });
    }

    return retData;
  };

  const batchRenderDanmakuPool = async (batch) => {
    const dmData = getBatchDanmakuData(batch);
    const danmakuPool = getDanmakuPoolRef();
    const media = getVideoRef();

    console.info(`batchRenderDanmakuPool batch=${batch}`, dmData)

    if (danmakuPool.length < MAX_POOL_NUM) {
      const newDanmakuContainerRef = appendDanmakuWraperTo(getContainerRef());
      console.info(newDanmakuContainerRef);

      setTimeout(() => {
        const newDmIns = new Danmaku({
        container: newDanmakuContainerRef,
        media,
        comments: dmData,
      });
      danmakuPool.push([newDmIns, newDanmakuContainerRef]);
      }, 1000);
      return;
    }

    let oldDanmakuPoolItem = danmakuPool[0];
    danmakuPool[0] = danmakuPool[1];
    oldDanmakuPoolItem[0].destroy();
    oldDanmakuPoolItem[1].innerHTML = '';
    danmakuPool[1] = [
      new Danmaku({
        container: oldDanmakuPoolItem[1],
        media: getVideoRef(),
        comments: dmData,
      }),
      oldDanmakuPoolItem[1],
    ];
    oldDanmakuPoolItem = null;
  };

  const videoTimeupdateHandler = () => {
    const currentTime = Number.parseInt(this.currentTime);
    const cnt = Number.parseInt(currentTime / VIDEO_TIME_SLOT_UNIT);
    if (cnt !== store.timeCount) {
      // batchRenderDanmakuPool(cnt);
      setStore('timeCount', store.timeCount + 1);
    }
  }

  const addVideoTimeupdateEventListener = () => {
    getVideoRef().addEventListener('timeupdate', videoTimeupdateHandler)
  };

  const removeVideoTimeupdateEventListener = () => {
    getVideoRef().removeEventListener('timeupdate', videoTimeupdateHandler)
  };

  const injectBilibliUpliadDanmaku = () => {
    const danmakuPool = getDanmakuPoolRef();
    const media = getVideoRef();

    const comments = getUploadedDanmakuData();
    const newDanmakuWraperRef = appendDanmakuWraperTo(getContainerRef());
    const danmakuRef = new Danmaku({
      container: newDanmakuWraperRef,
      media,
      comments,
    });
    danmakuPool.push([danmakuRef, newDanmakuWraperRef]);
  }

  onDanmakuDataUpdate(() => {
    console.info('onDanmakuDataUpdate invoked!');

    // let oldDanmakuPoolItem = danmakuPool[0];
    // danmakuPool[0] = danmakuPool[1];
    // oldDanmakuPoolItem[0].destroy();
    // oldDanmakuPoolItem[1].innerHTML = '';
    // danmakuPool[1] = [
    //   new Danmaku({
    //     container: oldDanmakuPoolItem[1],
    //     media: getVideoRef(),
    //     comments,
    //   }),
    //   oldDanmakuPoolItem[1],
    // ];
    // oldDanmakuPoolItem = null;
  });

  return (
    <div id="danmaku-migrate_container" ref={setContainerRef} className={`absolute top-0 bottom-0 left-0 w-full z-1001 overflow-hidden ${getPropClassName()}`} style="pointer-events: none;">
      <Controlbar
        onConsumeDanmaku={() => {
          if (store.danmakuSource === DanmakuSource.Bilibili && store.bilibiliDanmakuGetterType === BilibiliDanmakuGetterType.UploadFile) {
            injectBilibliUpliadDanmaku();
            return;
          }

          addVideoTimeupdateEventListener();
        }}
        onDanmakuOperateBtn={(type) => {
          const danmakuPool = getDanmakuPoolRef();
          const operateDanmaku = (cb) => {
            for (const [danmakuRef] of danmakuPool) {
              cb(danmakuRef);
            }
          }

          switch (type) {
            case DanmakuOperateType.Resize:
              operateDanmaku((ins) => ins.resize());
              break;
            default:
              console.warn(`Unexcept DanmakuOperateType, current is ${type}`);
          }
        }}
      ><InlineButton onClick={() => props.onCollapseBtn()}>收起</InlineButton></Controlbar>
    </div>
  );
};

export default DanmakuMigrate;
