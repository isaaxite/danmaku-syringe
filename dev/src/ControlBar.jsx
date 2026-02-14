import { createSignal } from "solid-js";
import { ControlBar } from "../../src/Components/ControlBar";
import { Block, Page } from "./Component";

export default () => {
  const [ref, setRef] = createSignal(null);
  const [danmakuOperationEnable, setDanmakuOperationEnable] = createSignal(false);
  return (
    <Page>
      <Block className="relative h-20" ref={setRef}>
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

      <Block className="relative h-20" ref={setRef}>
        <ControlBar
          danmakuOperationEnable={true}
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