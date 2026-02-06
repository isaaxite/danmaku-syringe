import { createSignal } from "solid-js";
import VideoContainer from "../VideoContainer";
import { DanmakuFusion } from "./index";
import { render } from "solid-js/web";
import { IconRadiusButton } from "../Component/Button";
import { CollapseIcon } from "../Component/Svg";

export const therealDanmakuFusionRender = (
  rootRef,
  videoRef,
) => render(() => (
  <DanmakuFusion
    videoRef={videoRef}
    rootRef={rootRef}
  />
), rootRef);

export const substituteDanmakuFusionRender = (videoSrc) => {
  const rootRef = document.createElement('DIV');
  rootRef.setAttribute('id', 'danmaku-migrate_substitute-root');
  rootRef.classList = 'absolute top-0 bottom-0 left-0 w-full z-1000 pointer-events-none';
  document.body.appendChild(rootRef);

  render(() => {
    const [getSubstituteVideoRef, setSubstituteVideoRef] = createSignal(null);
    const [isHideVideoContainer, setIsHideVideoContainer] = createSignal(false);

    return (
      <>
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
      </>
    );
  }, rootRef);
};
