import { createSignal, onMount } from "solid-js";
import { DanmakuPool } from "../../src/DanmakuPool";
import { Page } from "./Component";

const MOCK_DATA = [
  {
    "text": "怎么偷看别人的信呢",
    "time": 1.952,
    "style": {
      "fontSize": "25px",
      "color": "#FFFFFF",
      "lineHeight": "36px",
      "textShadow": "-1px -1px #000, -1px 1px #000, 1px -1px #000, 1px 1px #000"
    }
  },
  {
    "text": "你别代替别人和解啊把信还回去",
    "time": 4.224,
    "style": {
      "fontSize": "25px",
      "color": "#FFFFFF",
      "lineHeight": "36px",
      "textShadow": "-1px -1px #000, -1px 1px #000, 1px -1px #000, 1px 1px #000"
    }
  },
  {
    "text": "你怎么看给别人的信啊",
    "time": 7.308,
    "style": {
      "fontSize": "25px",
      "color": "#FFFFFF",
      "lineHeight": "36px",
      "textShadow": "-1px -1px #000, -1px 1px #000, 1px -1px #000, 1px 1px #000"
    }
  },
  {
    "text": "为什么要偷看？",
    "time": 8.367,
    "style": {
      "fontSize": "25px",
      "color": "#FFFFFF",
      "lineHeight": "36px",
      "textShadow": "-1px -1px #000, -1px 1px #000, 1px -1px #000, 1px 1px #000"
    }
  },
  {
    "text": "一人",
    "time": 5.352,
    "style": {
      "fontSize": "25px",
      "color": "#FFFFFF",
      "lineHeight": "36px",
      "textShadow": "-1px -1px #000, -1px 1px #000, 1px -1px #000, 1px 1px #000"
    }
  },
  {
    "text": "第一个",
    "time": 9.938,
    "style": {
      "fontSize": "25px",
      "color": "#FFFFFF",
      "lineHeight": "36px",
      "textShadow": "-1px -1px #000, -1px 1px #000, 1px -1px #000, 1px 1px #000"
    }
  },
  {
    "text": "加油",
    "time": 2.444,
    "style": {
      "fontSize": "25px",
      "color": "#FFFFFF",
      "lineHeight": "36px",
      "textShadow": "-1px -1px #000, -1px 1px #000, 1px -1px #000, 1px 1px #000"
    }
  },
  {
    "text": "1",
    "time": 3.597,
    "style": {
      "fontSize": "25px",
      "color": "#FFFFFF",
      "lineHeight": "36px",
      "textShadow": "-1px -1px #000, -1px 1px #000, 1px -1px #000, 1px 1px #000"
    }
  }
];

const getRandomData = (length) => {
  const ret = [];
  const getRandomIdx = () => Math.floor(Math.random() * MOCK_DATA.length);

  while (ret.length < length) {
    const idx = getRandomIdx();
    ret.push(MOCK_DATA[idx]);
  }

  return ret;
};

export default () => {
  const [timeCount, setTimeCount] = createSignal(-1);
  const [comments, setComments] = createSignal(null);
  const [videoRef] = createSignal(document.querySelector('#video-container video'));

  onMount(() => {
    const VIDEO_TIME_SLOT_UNIT = 30;
    videoRef().addEventListener('timeupdate', function() {
      const currentTime = Number.parseInt(this.currentTime);
      const curTimeCount = Number.parseInt(currentTime / VIDEO_TIME_SLOT_UNIT);
      if (curTimeCount !== timeCount()) {
        setTimeCount(curTimeCount);
        const newComments = getRandomData(VIDEO_TIME_SLOT_UNIT).map((item, idx) => {
          return {
            ...item,
            time: this.currentTime + idx,
          };
        });
        console.info(newComments);
        setComments(newComments);
      }
    });
  });

  return (
    <Page>
      <DanmakuPool
        comments={comments()}
        videoRef={videoRef()}
        rootRef={document.querySelector('#video-container')}
      />
    </Page>
  );
};
