import { SINGLE_DANMAKU_STYLE } from "../constant";
// import vqqDmJsonData from "../../test/asset/vqq_dm.mock.json";

function plusRandomMS(originTimeSec, msRange) {
  let time = Number.parseInt(originTimeSec);
  const randomMS = Number.parseInt(Math.random() * msRange);
  time = (time * msRange + randomMS) / msRange;
  return time;
}

function deduplicateVqqDanmaku(arr) {
  // 使用 Map 来存储唯一的键值对
  const map = new Map();
  
  arr.forEach(item => {
    // 创建基于 time 和 text 的唯一键
    const key = `${item.time_offset}|${item.content}`;
    
    // 如果这个键不存在，或者需要保留最新的记录（假设后面的更新）
    if (!map.has(key)) {
      map.set(key, item);
    } else {
      const mapItem = map.get(key);
      mapItem.count = mapItem.count ? mapItem.count + 1 : 1;
    }
  });
  
  // 返回 Map 中的所有值
  return Array.from(map.values());
}

export async function requestVqqBatchDanmaku(vid, batch) {
  const startMS = batch * 30000;
  const endMS = startMS + 30000;

  let data = await fetch(`https://dm.video.qq.com/barrage/segment/${vid}/t/v1/${startMS}/${endMS}`)
    .then(response => response.json())
    .catch(error => console.error('请求失败:', error));

  let dmData = deduplicateVqqDanmaku(data.barrage_list);
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
