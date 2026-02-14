import { SINGLE_DANMAKU_STYLE } from "../../constant";
import { deduplicateDanmaku, plusRandomMS } from "../../utils";

export async function requestVqqBatchDanmaku(vid, batch) {
  const startMS = batch * 30000;
  const endMS = startMS + 30000;

  let data = await fetch(`https://dm.video.qq.com/barrage/segment/${vid}/t/v1/${startMS}/${endMS}`)
    .then(response => response.json())
    .catch(error => console.error('请求失败:', error));

  let dmData = deduplicateDanmaku(data.barrage_list, (item) => `${item.time_offset}|${item.content}`);
  data = null;
  dmData = dmData.map(item => {
    let time = Number.parseInt(item.time_offset / 1000);
    time = plusRandomMS(time, 100);
    return {
      text: item.count > 1 ? `${item.content} +${item.count}` : item.content,
      time,
      style: SINGLE_DANMAKU_STYLE,
    };
  });

  return dmData;
}
