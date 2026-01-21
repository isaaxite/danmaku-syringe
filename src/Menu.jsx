import { createSignal, Switch, Match, onMount } from "solid-js"
import { initDanmakuArea } from "../danmaku"
import "./styles/menu.css"
import jmldS2E1DM from "../test/asset/jl_s2e1_dm.json";
import Danmaku from "danmaku";
// import Danmaku from "danmaku/dist/esm/danmaku.dom.js";
import VideoContainer from "./VideoContainer";
import { render } from "solid-js/web";
import { xmlDanmakuToJson } from "./utils";
import xrjpvimfS1E11DMXMLStr from "../test/asset/xrjpvimf_s1e11.dm.xml";
import axios from "axios";

const btnDefClassList = "block w-full text-white px-3 py-2 rounded-sm";
const btnActClassList = "bg-blue-500 hover:bg-blue-700 cursor-pointer";
const btnDisableClassList = "bg-blue-300";


function injectDanmaku(container, media) {
  const dmData = [];

  // for (let i = 0; i < jmldS2E1DM.barrage_list.length; i++) {
  //   const item = jmldS2E1DM.barrage_list[i];
  //   dmData.push({
  //     text: item.content,
  //     time: item.time_offset / 100,
  //     style: {
  //       fontSize: '20px',
  //       color: '#ffffff',
  //       // border: '1px solid #337ab7',
  //       textShadow: '-1px -1px #000, -1px 1px #000, 1px -1px #000, 1px 1px #000'
  //     },
  //   });
  // }

  const xrjpvimfS1E11DM = xmlDanmakuToJson(xrjpvimfS1E11DMXMLStr);

  for (let i = 0; i < xrjpvimfS1E11DM.danmaku.length; i++) {
    const item = xrjpvimfS1E11DM.danmaku[i];
    dmData.push({
      text: item.content,
      time: item.time,
      style: {
        fontSize: '24px',
        color: '#ffffff',
        // border: '1px solid #337ab7',
        textShadow: '-1px -1px #000, -1px 1px #000, 1px -1px #000, 1px 1px #000'
      },
    });
  }

  // console.info(dmData)

  const dm = new Danmaku({
    container,
    media,
    comments: dmData
  });

  return dm;
}

async function requestVqqDanmaku(vid, startMS, endMS) {
  const { data } = await axios.get(`https://dm.video.qq.com/barrage/segment/${vid}/t/v1/${startMS}/${endMS}`);


  const dmData = [];

  let lastTimeOffset = 0;
  for (let i = 0; i < data.barrage_list.length; i++) {
    const item = data.barrage_list[i];
    let time = Number.parseInt(item.time_offset / 100);

    // if (time === lastTimeOffset) {
    //   time = (time * 100 + Number.parseInt((Math.random() * 100))) / 100;
    // } else {
    //   lastTimeOffset = time;
    // }

    time = (time * 100 + Number.parseInt((Math.random() * 100))) / 100;

    dmData.push({
      text: item.content,
      time,
      style: {
        fontSize: '24px',
        color: '#ffffff',
        // border: '1px solid #337ab7',
        textShadow: '-1px -1px #000, -1px 1px #000, 1px -1px #000, 1px 1px #000'
      },
    });
  }

  return dmData;
}

const Menu = () => {
  const [isDisableSelectVideoArea, setIsDisableSelectVideoArea] = createSignal(false);
  const [isDisableInsertDanmaku, setIsDisableInsertDanmaku] = createSignal(false);
  const [isDisableShiftDanmaku, setIsDisable3] = createSignal(true);
  const [getVcontainerRef, setVcontainerRef] = createSignal(null);
  const [getDmIns, setDmIns] = createSignal(null);
  const [getCnt, setCnt] = createSignal(0);
  const [getLastDanmakuContainerRef, setLastDanmakuContainerRef] = createSignal(null);
  const [getNewVideoRef, setNewVideoRef] = createSignal(null);

  const selectVideoAreahandler = () => {
    if (isDisableSelectVideoArea()) {
      return false;
    }

    setIsDisableSelectVideoArea(true);

    initDanmakuArea((xx) => {
      console.info(222, xx);
      setIsDisableInsertDanmaku(false);
    });
  };

  const insertDanmaku = () => {
    const dmData = [];

    for (let i = 0; i < jmldS2E1DM.barrage_list.length; i++) {
      const item = jmldS2E1DM.barrage_list[i];
      dmData.push({
        text: item.content,
        time: item.time_offset / 100,
        style: {
          fontSize: '20px',
          color: '#ffffff',
          // border: '1px solid #337ab7',
          textShadow: '-1px -1px #000, -1px 1px #000, 1px -1px #000, 1px 1px #000'
        },
      });
    }

    const media = document.querySelector('video');
    // const container1 = media.parentElement;
    const container = document.createElement('DIV');
    container.setAttribute('id', 'my-danmaku-container');
    // media.parentElement.appendChild(container);
    document.body.appendChild(container);

    const dm = new Danmaku({
      // container: document.getElementById('danmaku-container'),
      // media: document.getElementById('video'),
      container,
      media,
      comments: dmData
    });

    console.info(dm);
  };

  const cloneDanmaku = () => {

  };

  const delayDestoryLastDanmaku = (danmakuContainerRef, dmIns) => {
    if (!danmakuContainerRef || !dmIns) {
      return;
    }
    setTimeout(() => {
      danmakuContainerRef.remove();
      // dmIns.destroy();
    }, 3 * 1000);
  };



  const insertVideoContainer = () => {
    const danmakuContainerID = 'danmaku-migrate_danmaku-reander-container';
    let vcontainerRef;
    // let danmakuContainerRef = document.getElementById(danmakuContainerID);
    // let newVideoRef;

    const insertDanmakuContainer = (cnt) => {
      const danmakuContainerID = `danmaku-migrate_danmaku-reander-container-${cnt}`;
      const newDanmakuContainerRef = document.createElement('DIV');
      newDanmakuContainerRef.setAttribute('id', danmakuContainerID);
      newDanmakuContainerRef.classList = `absolute top-20 bottom-20 left-0 w-full z-${20 + cnt}`;
      newDanmakuContainerRef.style = "pointer-events: none;";
      getVcontainerRef().appendChild(newDanmakuContainerRef);
      return newDanmakuContainerRef;
    };

    const updateDanmaku = async (curCnt) => {
      const startMS = curCnt * 30000;
      const endMS = startMS + 30000;
      const dmData = await requestVqqDanmaku('p410184b5jy', startMS, endMS);

      // delayDestoryLastDanmaku(getLastDanmakuContainerRef(), getDmIns());

      getDmIns() && getDmIns().destroy();

      const danmakuContainerRef = insertDanmakuContainer(curCnt);
      const newDmIns = new Danmaku({
        container: danmakuContainerRef,
        media: getNewVideoRef(),
        comments: dmData,
      });
      console.info(dmData);
      setDmIns(newDmIns);
      setLastDanmakuContainerRef(danmakuContainerRef);
    };

    // if (!danmakuContainerRef) {
    const vcontainerID = 'danmaku-migrate_video-container';
    vcontainerRef = document.createElement('DIV');
    vcontainerRef.setAttribute('id', vcontainerID);
    vcontainerRef.classList = "absolute top-0 left-0 size-full z-10";
    // danmakuContainerRef = document.createElement('DIV');
    // danmakuContainerRef.setAttribute('id', danmakuContainerID);
    // danmakuContainerRef.classList = "absolute top-20 bottom-20 left-0 w-full z-20";
    // danmakuContainerRef.style = "pointer-events: none;";
    // vcontainerRef.appendChild(danmakuContainerRef);
    // insertDanmakuContainer(0);
    document.body.appendChild(vcontainerRef);
    // }

    setVcontainerRef(vcontainerRef);

    const originVideo = document.querySelector('video');
    const src = originVideo.getAttribute('src');
    originVideo.src = undefined;

    render(() => <VideoContainer ref={setNewVideoRef} src={src} />, vcontainerRef);

    setTimeout(() => {
      // const curIns = injectDanmaku(danmakuContainerRef, newVideoRef);
      // setDmIns(curIns);

      updateDanmaku(0);

      getNewVideoRef().addEventListener('timeupdate', function() {
        const UNIT = 30;
        const currentTime = Number.parseInt(this.currentTime);
        const cnt = Number.parseInt(currentTime / UNIT);
        // console.info(currentTime, cnt, getCnt())
        if (cnt !== getCnt()) {
          updateDanmaku(cnt);
          setCnt(cnt);
        }
      });
    });
  };

  const handleFullscreenChange = () => {
    setTimeout(() => {
      getDmIns().resize();
    },200);
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
      {/* <Switch>
        <Match when={isDisableShiftDanmaku()}>
          <li><button className={`${btnDefClassList} ${isDisableSelectVideoArea() ? btnDisableClassList : btnActClassList}`}  onClick={selectVideoAreahandler}>选择视频区域</button></li>
          <li><button className={`${btnDefClassList} mt-2 ${isDisableInsertDanmaku() ? btnDisableClassList : btnActClassList}`} onClick={insertDanmaku}>注入弹幕</button></li>
        </Match>
        <Match when={!isDisableShiftDanmaku()}>
          <li><button className={`${btnDefClassList} mt-2 ${isDisableShiftDanmaku() ? btnDisableClassList : btnActClassList}`} onClick={cloneDanmaku}>克隆弹幕</button></li>
        </Match>
      </Switch> */}
      <li><button className={`${btnDefClassList} mt-2 ${btnActClassList}`} onClick={insertVideoContainer}>替换视频容器</button></li>
      <li><button className={`${btnDefClassList} mt-2 ${btnActClassList}`} onClick={toggleFullscreen}>全屏</button></li>
    </ul>
  );
};

export default Menu;
