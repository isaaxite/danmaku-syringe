import { createSignal, onMount } from "solid-js"
import Danmaku from "danmaku";
import VideoContainer from "./VideoContainer";
import { render } from "solid-js/web";
import axios from "axios";
import { xmlDanmakuToJson } from "./utils";
// import vqqDanmakuMockData from "../test/asset/vetm_dm.mock.json";
import bilibiliDMData from '../test/asset/dm.xml';

const btnDefClassList = "block w-full text-white px-3 py-2 rounded-sm";
const btnActClassList = "bg-blue-500 hover:bg-blue-700 cursor-pointer";
// const btnDisableClassList = "bg-blue-300";
const SINGLE_DANMAKU_STYLE = {
  fontSize: '24px',
  color: '#ffffff',
  lineHeight: '36px',
  textShadow: '-1px -1px #000, -1px 1px #000, 1px -1px #000, 1px 1px #000'
};
const Vtypes = {
  VQQ: 'vqq',
  BILIBILI: 'bilibili',
};

function plusRandomMS(originTimeSec, msRange) {
  let time = Number.parseInt(originTimeSec);
  const randomMS = Number.parseInt(Math.random() * msRange);
  time = (time * msRange + randomMS) / msRange;
  return time;
}

async function requestVqqDanmaku(vid, batch) {
  const startMS = batch * 30000;
  const endMS = startMS + 30000;

  // const batchData = vqqDanmakuMockData[`${startMS}-${endMS}`];
  // if (batchData) {
  //   return batchData.map(({ text, time }) => {
  //     const fixTime = Number.parseInt(time / 10);
  //     return {
  //       // text: `${startMS / 1000}-${endMS / 1000}|${fixTime}: ${text}`,
  //       text,
  //       time: plusRandomMS(fixTime, 1000),
  //       style: SINGLE_DANMAKU_STYLE
  //     };
  //   });
  // }

  const { data } = await axios.get(`https://dm.video.qq.com/barrage/segment/${vid}/t/v1/${startMS}/${endMS}`);

  const dmData = data.barrage_list.map(item => {
    let time = Number.parseInt(item.time_offset / 1000);
    time = plusRandomMS(time, 100);
    return {
      text: item.content,
      time,
      style: SINGLE_DANMAKU_STYLE,
    };
  });

  return dmData;
}

async function requestBilibliDnamaku(oid, batch) {
  const startMS = batch * 30000;
  const endMS = startMS + 30000;
  const bilibiliDMJSON = xmlDanmakuToJson(bilibiliDMData);

  const retData = [];
  for (const item of bilibiliDMJSON.danmaku) {
    const itemMS = item.time * 1000;
    if (startMS <= itemMS && itemMS < endMS) {
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
  }

  return retData;
  const { data } = await axios.get('https://api.bilibili.com/x/v1/dm/list.so', {
    params: { oid },
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Referer': 'https://www.bilibili.com',
      'Origin': 'https://www.bilibili.com',
      'Accept': '*/*',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
    }
  });

  console.info(data)
  const ret = xmlDanmakuToJson(data)
  console.info(ret);
}

function appendDanmakuContainerTo(vcontainerRef, cnt) {
  const danmakuContainerID = `danmaku-migrate_danmaku-reander-container-${cnt}`;
  const newDanmakuContainerRef = document.createElement('DIV');
  newDanmakuContainerRef.setAttribute('id', danmakuContainerID);
  newDanmakuContainerRef.classList = 'absolute top-20 bottom-20 left-0 w-full z-1000';
  newDanmakuContainerRef.style = "pointer-events: none;";
  vcontainerRef.appendChild(newDanmakuContainerRef);
  return newDanmakuContainerRef;
};

const Menu = () => {
  const [getVcontainerRef, setVcontainerRef] = createSignal(null);
  const [getCnt, setCnt] = createSignal(0);
  const [getNewVideoRef, setNewVideoRef] = createSignal(null);
  const [getDanmakuPoolRef] = createSignal([]);
  const [getZenCursorTimer, setZenCursorTimer] = createSignal(0);
  const [getVtype, setVtype] = createSignal(Vtypes.VQQ);
  const [getVideoId, setVideoId] = createSignal('35354313629');

  const batchRenderDanmakuPool = async (batch) => {
    const MAX_POOL_NUM = 2;
    const dmData = getVtype() === Vtypes.VQQ
      ? await requestVqqDanmaku(getVideoId(), batch)
      : await requestBilibliDnamaku(getVideoId(), batch);
    const danmakuPool = getDanmakuPoolRef();

    // console.info(dmData)
    // return;

    if (danmakuPool.length < MAX_POOL_NUM) {
      const newDanmakuContainerRef = appendDanmakuContainerTo(getVcontainerRef(), batch);
      const newDmIns = new Danmaku({
        container: newDanmakuContainerRef,
        media: getNewVideoRef(),
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
        media: getNewVideoRef(),
        comments: dmData,
      }),
      oldDanmakuPoolItem[1],
    ];
    oldDanmakuPoolItem = null;
  };

  const queryOriginVideoEle = () => {
    return document.querySelector('video');
  };

  const insertVideoContainer = () => {
    const vcontainerRef = document.createElement('DIV');
    vcontainerRef.setAttribute('id', 'danmaku-migrate_video-container');
    vcontainerRef.classList = "absolute top-0 left-0 size-full z-1000";
    document.body.appendChild(vcontainerRef);
    setVcontainerRef(vcontainerRef);

    const originVideo = queryOriginVideoEle();
    const src = originVideo.getAttribute('src');
    originVideo.src = undefined;

    render(() => <VideoContainer onMount={() => {
      batchRenderDanmakuPool(0);
      getNewVideoRef().addEventListener('timeupdate', function() {
        const UNIT = 30;
        const currentTime = Number.parseInt(this.currentTime);
        const cnt = Number.parseInt(currentTime / UNIT);
        if (cnt !== getCnt()) {
          batchRenderDanmakuPool(cnt);
          setCnt(cnt);
        }
      });
    }} ref={setNewVideoRef} src={src} />, vcontainerRef);
  };

  const zenCursorMousemoveHandler = () => {
    getZenCursorTimer() && clearTimeout(getZenCursorTimer());

    if (!getZenCursorTimer() && getVcontainerRef().style.cssText.includes('cursor: none')) {
      console.info('recover cursor')
      getVcontainerRef().style = "cursor: auto;";
    }

    if (!document.fullscreenElement) {
      return;
    }

    const timer = setTimeout(() => {
      if (getNewVideoRef().paused) {
        console.info('video pause, so do not hide cursor')
        return;
      }
      console.info('cursor hide');
      getVcontainerRef().style = "cursor: none !important;";
      setZenCursorTimer(0);
    }, 2000);
    setZenCursorTimer(timer);
  };

  const handleFullscreenChange = () => {
    setTimeout(() => {
      for (const [dmIns] of getDanmakuPoolRef()) {
        dmIns.resize();
      }
    }, 200);

    if (document.fullscreenElement) {
      document.addEventListener('mousemove', zenCursorMousemoveHandler);
    } else {
      document.removeEventListener('mousemove', zenCursorMousemoveHandler);
      getVcontainerRef().style = "cursor: auto;";
      console.info('removeEventListener zenCursor');
    }
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      getVcontainerRef().requestFullscreen();
    }
  };

  onMount(() => {
    // 监听各种全屏事件
    [
      'fullscreenchange',
      'webkitfullscreenchange',
      'mozfullscreenchange',
      'MSFullscreenChange'
    ].forEach(eventName => {
      document.addEventListener(eventName, handleFullscreenChange, false);
    });
  });

  return (
    <ul className="absolute top-60 right-2 bg-slate-50 px-2 py-3 shadow-md">
      <li>
        <button className={`${btnDefClassList} mt-2 ${btnActClassList}`} onClick={insertVideoContainer}>替换视频容器</button>
      </li>
      <li>
        <select name="vtype" id="cars" onChange={(e) => setVtype(e.target.value)}>
          <option value="vqq">腾讯视频</option>
          <option value="bilibili">Bilibili</option>
        </select>
        <input type="text" value={getVideoId()} placeholder={getVtype() === Vtypes.VQQ ? 'vid' : 'oid'} id="video-id_input" onInput={(e) => setVideoId(e.target.value)} />
      </li>
      <li><button className={`${btnDefClassList} mt-2 ${btnActClassList}`} onClick={toggleFullscreen}>全屏</button></li>
    </ul>
  );
};

export default Menu;
