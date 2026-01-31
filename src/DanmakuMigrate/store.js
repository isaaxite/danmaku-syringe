import { createStore } from "solid-js/store";

export const DanmakuSource = {
  Vqq: 'vqq',
  Bilibili: 'bilibili',
};

export const BilibiliDanmakuGetterType = {
  LocalServe: 'localserve',
  UploadFile: 'uploadfile',
  XmlText: 'xmltext',
};

export const [store, setStore] = createStore({
  timeCount: -1,
  danmakuSource: DanmakuSource.Vqq,
  bilibiliDanmakuGetterType: BilibiliDanmakuGetterType.XmlText,
  danmakuData: null,
  videoId: '',  // for api, not html element attribute
  // videoId: 'j4101ouc4ve',
});

