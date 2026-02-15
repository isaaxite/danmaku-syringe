import { createSignal, onMount } from "solid-js";
import VideoContainer from "../VideoContainer";
import { DanmakuFusion } from "./index";
import { render } from "solid-js/web";
import { IconRadiusButton } from "../Common/Button";
import { CollapseIcon } from "../Common/Svg";
import { Tailwindcss } from "../Common/StyleRoot";
import { createRoot } from "../../utils";

export const therealDanmakuFusionRender = (
  rootRef,
  videoRef,
) => {
  const { shadowRef } = createRoot(rootRef, {
    id: 'danmaku-migrate_thereal-root',
  });

  render(() => (
    <Tailwindcss>
      <DanmakuFusion
        videoRef={videoRef}
        rootRef={rootRef}
        shadowRef={shadowRef}
      />
    </Tailwindcss>
  ), shadowRef);
}

export const substituteDanmakuFusionRender = (videoSrc) => {
  const { rootRef, shadowRef } = createRoot(document.body, {
    id: 'danmaku-migrate_substitute-root',
    classList: 'absolute top-0 bottom-0 left-0 w-full z-1000 pointer-events-none',
  });

  render(() => {
    const [getSubstituteVideoRef, setSubstituteVideoRef] = createSignal(null);
    const [isHideVideoContainer, setIsHideVideoContainer] = createSignal(false);

    return (
      <Tailwindcss>
        <div
          className={`
            ${isHideVideoContainer() ? '-translate-y-full' : 'translate-y-0'}
            transition
            bg-black absolute top-0 bottom-0 left-0 w-full z-1000 pointer-events-auto text-sm
          `}
        >
          <VideoContainer
            ref={setSubstituteVideoRef}
            src={videoSrc}
          />
          <DanmakuFusion
            videoRef={getSubstituteVideoRef()}
            rootRef={rootRef}
            shadowRef={shadowRef}
            showCollapseBtn={true}
            onClickCollapseBtn={() => setIsHideVideoContainer(true)}
          />
        </div>
        {isHideVideoContainer() ? (
          <IconRadiusButton
            className="pointer-events-auto absolute top-3 right-3 rotate-180 origin-center shadow shadow-gray-700"
            onClick={() => setIsHideVideoContainer(false)}
          ><CollapseIcon class="size-5"/></IconRadiusButton>
        ) : (<></>)}
      </Tailwindcss>
    );
  }, shadowRef);
};
