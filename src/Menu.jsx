import { createSignal, onMount } from "solid-js"
import "./styles/menu.css"
import Danmaku from "danmaku";
import VideoContainer from "./VideoContainer";
import { render } from "solid-js/web";
import axios from "axios";
// import vqqDanmakuMockData from "../test/asset/vetm_dm.mock.json";

const btnDefClassList = "block w-full text-white px-3 py-2 rounded-sm";
const btnActClassList = "bg-blue-500 hover:bg-blue-700 cursor-pointer";
// const btnDisableClassList = "bg-blue-300";

function plusRandomMS(originTimeSec, msRange) {
  let time = Number.parseInt(originTimeSec);
  const randomMS = Number.parseInt(Math.random() * msRange);
  time = (time * msRange + randomMS) / msRange;
  return time;
}

async function requestVqqDanmaku(vid, startMS, endMS) {
  const style = {
    fontSize: '24px',
    color: '#ffffff',
    lineHeight: '36px',
    textShadow: '-1px -1px #000, -1px 1px #000, 1px -1px #000, 1px 1px #000'
  };

  // const batchData = vqqDanmakuMockData[`${startMS}-${endMS}`];
  // if (batchData) {
  //   return batchData.map(({ text, time }) => {
  //     const fixTime = Number.parseInt(time / 10);
  //     return {
  //       // text: `${startMS / 1000}-${endMS / 1000}|${fixTime}: ${text}`,
  //       text,
  //       time: plusRandomMS(fixTime, 1000),
  //       style
  //     };
  //   });
  // }

  const { data } = await axios.get(`https://dm.video.qq.com/barrage/segment/${vid}/t/v1/${startMS}/${endMS}`);


  const dmData = [];
  for (let i = 0; i < data.barrage_list.length; i++) {
    const item = data.barrage_list[i];
    let time = Number.parseInt(item.time_offset / 1000);

    time = plusRandomMS(time, 100);

    dmData.push({
      text: item.content,
      time,
      style,
    });
  }

  return dmData;
}


function appendDanmakuContainerTo(vcontainerRef, cnt) {
  const danmakuContainerID = `danmaku-migrate_danmaku-reander-container-${cnt}`;
  const newDanmakuContainerRef = document.createElement('DIV');
  newDanmakuContainerRef.setAttribute('id', danmakuContainerID);
  newDanmakuContainerRef.classList = 'absolute top-20 bottom-20 left-0 w-full z-20';
  newDanmakuContainerRef.style = "pointer-events: none;";
  vcontainerRef.appendChild(newDanmakuContainerRef);
  return newDanmakuContainerRef;
};

const Menu = () => {
  const [getVcontainerRef, setVcontainerRef] = createSignal(null);
  const [getCnt, setCnt] = createSignal(0);
  const [getNewVideoRef, setNewVideoRef] = createSignal(null);
  const [getDanmakuPoolRef] = createSignal([]);

  const insertVideoContainer = () => {
    const danmakuContainerID = 'danmaku-migrate_danmaku-reander-container';
    let vcontainerRef;

    const updateDanmaku = async (curCnt) => {
      const startMS = curCnt * 30000;
      const endMS = startMS + 30000;
      const dmData = await requestVqqDanmaku('p410184b5jy', startMS, endMS);
      const danmakuPool = getDanmakuPoolRef();

      if (danmakuPool.length < 2) {
        const newDanmakuContainerRef = appendDanmakuContainerTo(vcontainerRef, curCnt);
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

    const vcontainerID = 'danmaku-migrate_video-container';
    vcontainerRef = document.createElement('DIV');
    vcontainerRef.setAttribute('id', vcontainerID);
    vcontainerRef.classList = "absolute top-0 left-0 size-full z-10";
    document.body.appendChild(vcontainerRef);

    setVcontainerRef(vcontainerRef);

    const originVideo = document.querySelector('video');
    const src = originVideo.getAttribute('src');
    originVideo.src = undefined;

    render(() => <VideoContainer ref={setNewVideoRef} src={src} />, vcontainerRef);

    setTimeout(() => {
      updateDanmaku(0);
      getNewVideoRef().addEventListener('timeupdate', function() {
        const UNIT = 30;
        const currentTime = Number.parseInt(this.currentTime);
        const cnt = Number.parseInt(currentTime / UNIT);
        if (cnt !== getCnt()) {
          updateDanmaku(cnt);
          setCnt(cnt);
        }
      });
    });
  };

  const handleFullscreenChange = () => {
    setTimeout(() => {
      for (let [dmIns] of getDanmakuPoolRef()) {
        dmIns.resize();
      }
    }, 200);
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      getVcontainerRef().requestFullscreen();
    }
  };

  onMount(() => {
    document.body.style = "font-size: 16px;";
    // 监听各种全屏事件
    const fullscreenEvents = [
      'fullscreenchange',
      'webkitfullscreenchange',
      'mozfullscreenchange',
      'MSFullscreenChange'
    ];
    
    fullscreenEvents.forEach(eventName => {
      document.addEventListener(eventName, handleFullscreenChange, false);
    });
  });

  return (
    <ul className="absolute top-60 right-2 bg-slate-50 px-2 py-3 shadow-md">
      <li><button className={`${btnDefClassList} mt-2 ${btnActClassList}`} onClick={insertVideoContainer}>替换视频容器</button></li>
      <li><button className={`${btnDefClassList} mt-2 ${btnActClassList}`} onClick={toggleFullscreen}>全屏</button></li>
    </ul>
  );
};

export default Menu;
