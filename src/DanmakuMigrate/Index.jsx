import { createSignal } from "solid-js";
import Controlbar from "./Controlbar"
import { BilibiliDanmakuGetterType, DanmakuSource, onDanmakuDataUpdate, setStore, store } from "./store";
import Danmaku from "danmaku";
import { generateRandomString } from "../utils";
import { DanmakuOperateType } from "../constant";
import { InlineButton } from "../Component/Button";
import { requestVqqBatchDanmaku } from "./request";

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
  // const getRootRef = () => props.rootRef;
  const getVideoRef = () => props.videoRef;
  const [getContainerRef, setContainerRef] = createSignal(null);
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

  const batchRenderDanmakuPool = async (dmData) => {
    const danmakuPool = getDanmakuPoolRef();
    const media = getVideoRef();
    if (danmakuPool.length < MAX_POOL_NUM) {
      const newDanmakuContainerRef = appendDanmakuWraperTo(getContainerRef());
      const newDmIns = new Danmaku({
        container: newDanmakuContainerRef,
        media,
        comments: dmData,
      });
      danmakuPool.push([newDmIns, newDanmakuContainerRef]);
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

  const onVideoTimeupdate = (cb) => {
    getVideoRef().addEventListener('timeupdate', function() {
      const currentTime = Number.parseInt(this.currentTime);
      const cnt = Number.parseInt(currentTime / VIDEO_TIME_SLOT_UNIT);
      if (cnt !== store.timeCount) {
        cb(cnt);
        setStore('timeCount', store.timeCount + 1);
      }
    })
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

  const consumeBilibiliDanmaku = () => {
    switch (store.bilibiliDanmakuGetterType) {
      case BilibiliDanmakuGetterType.UploadFile:
        injectBilibliUpliadDanmaku();
        break;
      default:
        console.warn(`Unexcept BilibiliDanmakuGetterType, current is ${store.bilibiliDanmakuGetterType}`);
    }
  };

  const consumeVqqDanmaku = () => {
    console.info('consumeVqqDanmaku invoked!', store.videoId);
    onVideoTimeupdate(async (batch) => {
      const dmData = await requestVqqBatchDanmaku(store.videoId, batch);
      batchRenderDanmakuPool(dmData);
    });
  };

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
          switch (store.danmakuSource) {
            case DanmakuSource.Bilibili:
              consumeBilibiliDanmaku();
              break;
            case DanmakuSource.Vqq:
              consumeVqqDanmaku();
              break;
            default:
              console.warn(`Unexcept DanmakuSource Type, current is ${store.danmakuSource}`);
          }
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
