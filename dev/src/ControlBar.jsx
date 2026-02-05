import { createSignal } from "solid-js";
import { ControlBar } from "../../src/ControlBar";
import { Block, Page } from "./Component";

export default () => {
  const [ref, setRef] = createSignal(null);
  const [danmakuOperationEnable, setDanmakuOperationEnable] = createSignal(false);
  return (
    <Page>
      <Block ref={setRef}>
        <ControlBar
          danmakuOperationEnable={danmakuOperationEnable()}
          onClickApplyDanmakuSrc={(...rest) => {
            console.info(...rest)
            setDanmakuOperationEnable(true);
          }}
          onClickToggleFullscreen={() => {
            if (document.fullscreenElement) {
              document.exitFullscreen();
            } else {
              ref().requestFullscreen();
            }
          }}
          onClickDanmakuOperate={(...rest) => {
            console.info(...rest)
          }}
        />
      </Block>
    </Page>
  );
};