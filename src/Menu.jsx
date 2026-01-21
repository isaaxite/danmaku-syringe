import { createSignal, Switch, Match, onMount } from "solid-js"
import { initDanmakuArea } from "../danmaku"
import "./styles/menu.css"
import jmldS2E1DM from "../test/asset/jl_s2e1_dm.json";
import Danmaku from "danmaku";
import VideoContainer from "./VideoContainer";
import { render } from "solid-js/web";
import { xmlDanmakuToJson } from "./utils";
import xrjpvimfS1E11DMXMLStr from "../test/asset/xrjpvimf_s1e11.dm.xml";

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

const Menu = () => {
  const [isDisableSelectVideoArea, setIsDisableSelectVideoArea] = createSignal(false);
  const [isDisableInsertDanmaku, setIsDisableInsertDanmaku] = createSignal(false);
  const [isDisableShiftDanmaku, setIsDisable3] = createSignal(true);
  const [vcontainerRef, setVcontainerRef] = createSignal(null);

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

  const insertVideoContainer = () => {
    const danmakuContainerID = 'danmaku-migrate_danmaku-reander-container';
    let vcontainerRef;
    let danmakuContainerRef = document.getElementById(danmakuContainerID);
    let newVideoRef;

    if (!danmakuContainerRef) {
      const vcontainerID = 'danmaku-migrate_video-container';
      vcontainerRef = document.createElement('DIV');
      vcontainerRef.setAttribute('id', vcontainerID);
      vcontainerRef.classList = "absolute top-0 left-0 size-full z-10";
      danmakuContainerRef = document.createElement('DIV');
      danmakuContainerRef.setAttribute('id', danmakuContainerID);
      danmakuContainerRef.classList = "absolute top-0 left-0 size-full z-20";
      danmakuContainerRef.style = "pointer-events: none;";
      vcontainerRef.appendChild(danmakuContainerRef);
      document.body.appendChild(vcontainerRef);
    }

    setVcontainerRef(vcontainerRef);

    const originVideo = document.querySelector('video');
    const src = originVideo.getAttribute('src');
    originVideo.src = undefined;

    render(() => <VideoContainer ref={newVideoRef} src={src} />, vcontainerRef);

    setTimeout(() => injectDanmaku(danmakuContainerRef, newVideoRef));
  };

  const toggleFullscreen = () => {

  };

  onMount(() => {
    document.body.style = "font-size: 16px;"
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
