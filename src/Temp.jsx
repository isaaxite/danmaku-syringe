import Danmaku from 'danmaku';
import "./styles/menu.css"
import { createSignal } from 'solid-js';

const btnDefClassList = "block w-full text-white px-3 py-2 rounded-sm";
const btnActClassList = "bg-blue-500 hover:bg-blue-700 cursor-pointer";
const btnDisableClassList = "bg-blue-300";

function getDanmakuData(currentTime) {
  const dmData = [];
  for(let i = 0; i < 100; i+=20) {
    let time = currentTime + 3 + i;
    for (let j = 0; j < 20; j++) {
      time = Number.parseInt(time * 100 + Number.parseInt(Math.random() * 100)) / 100
      dmData.push({
        text: `${time}_${j}`,
        time,
        style: {
          fontSize: '24px',
          color: '#ffffff',
          // border: '1px solid #337ab7',
          textShadow: '-1px -1px #000, -1px 1px #000, 1px -1px #000, 1px 1px #000'
        },
      });
    }
  }

  return dmData;
}

const App = () => {

  const [getCnt, setCnt] = createSignal(0);

  const insertDanmakuContainer = (cnt) => {
    const danmakuContainerID = `danmaku-migrate_danmaku-reander-container-${cnt}`;
    const newDanmakuContainerRef = document.createElement('DIV');
    newDanmakuContainerRef.setAttribute('id', danmakuContainerID);
    newDanmakuContainerRef.classList = `absolute top-20 bottom-20 left-0 w-full z-${20 + cnt}`;
    newDanmakuContainerRef.style = "pointer-events: none;";
    document.getElementById('video-container').appendChild(newDanmakuContainerRef);
    return newDanmakuContainerRef;
  };


  const insertVideoContainer = () => {
    const danmakuContainerRef = insertDanmakuContainer(0);
    const videoRef = document.getElementById('video');
    const dmData = getDanmakuData(0);
    const newDmIns = new Danmaku({
      container: danmakuContainerRef,
      media: videoRef,
      comments: dmData,
    });
    console.info(dmData);

    const updateDanmaku = (cnt) => {
      console.info('updateDanmaku', cnt);
      const dmData = getDanmakuData(cnt);
      console.info(dmData);
      for (const item of dmData) {
        newDmIns.emit(item);
      }
    };

    videoRef.addEventListener('timeupdate', function() {
      const UNIT = 10;
      const currentTime = Number.parseInt(this.currentTime);
      const cnt = Number.parseInt(currentTime / UNIT);
      // console.info(currentTime, cnt, getCnt())
      if (cnt !== getCnt()) {
        updateDanmaku(currentTime);
        setCnt(cnt);
      }
    });
  };

  // console.log(getDanmakuData(1));

  return (
    <div className='absolute top-60 right-2 bg-slate-50 px-2 py-3 shadow-md'>
      <button className={`${btnDefClassList} mt-2 ${btnActClassList}`} onClick={insertVideoContainer}>替换视频容器</button>
    </div>
  );
};

export default App;