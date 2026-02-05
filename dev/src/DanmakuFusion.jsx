import { render } from "solid-js/web";
import { DanmakuFusion } from "../../src/DanmakuFusion";
import { createMemo, onMount } from "solid-js";

export default () => {
  const rootRef = createMemo(() => document.querySelector('#video-container'));
  const videoRef = createMemo(() => document.querySelector('#video-container video'));
  
  onMount(() => {
    setTimeout(() => {
      render(() => (
        <DanmakuFusion
          rootRef={rootRef()}
          videoRef={videoRef()}
        />
      ), rootRef());
    })
  });

  return (<div></div>);
};
