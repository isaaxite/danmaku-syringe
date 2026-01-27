import { createEffect } from "solid-js";
import { createStore } from "solid-js/store";

export const DanmakuSource = {
  Vqq: 'vqq',
  Bilibili: 'bilibili',
};

export const BilibiliDanmakuGetterType = {
  LocalServe: 'localserve',
  UploadFile: 'uploadfile',
};

export const [store, setStore] = createStore({
  timeCount: -1,
  danmakuSource: DanmakuSource.Bilibili,
  bilibiliDanmakuGetterType: BilibiliDanmakuGetterType.UploadFile,
  danmakuData: null,
});

export const onTimeupdate = (cb) => {
  createEffect(() => {
    cb(store.timeCount);
  });
}

export const onDanmakuDataUpdate = (cb) => {
  createEffect(() => {
    if (!store.danmakuData) {
      return;
    }
    cb(store.danmakuData);
  });
};

// export default { store, setStore };
