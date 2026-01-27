import axios from "axios";
import { SINGLE_DANMAKU_STYLE } from "../constant";

function plusRandomMS(originTimeSec, msRange) {
  let time = Number.parseInt(originTimeSec);
  const randomMS = Number.parseInt(Math.random() * msRange);
  time = (time * msRange + randomMS) / msRange;
  return time;
}

export async function requestVqqBatchDanmaku(vid, batch) {
  const startMS = batch * 30000;
  const endMS = startMS + 30000;

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
