import { createSignal } from "solid-js";
import { render } from "solid-js/web";
import VideoContainer from "./VideoContainer";
import DanmakuMigrate from "./DanmakuMigrate/Index";
import { ContainerType } from "./constant";

export const substituteDanmakuFusionRender = (videoSrc) => {
  const rootRef = document.createElement('DIV');
  rootRef.setAttribute('id', 'danmaku-migrate_substitute-root');
  rootRef.classList = 'absolute top-0 bottom-0 left-0 w-full z-1000';
  rootRef.style = 'pointer-events: none;';
  document.body.appendChild(rootRef);

  render(() => {
    const [getSubstituteVideoRef, setSubstituteVideoRef] = createSignal(null);
    const [isHideVideoContainer, setIsHideVideoContainer] = createSignal(false);

    return (
      <div
        className={`${isHideVideoContainer() ? '-translate-y-full' : ''} bg-black absolute top-0 bottom-0 left-0 w-full z-1000`}
        style="pointer-events: auto;"
      >
        <VideoContainer
          ref={setSubstituteVideoRef}
          src={videoSrc}
        />
        <DanmakuMigrate
          containerType={ContainerType.Substitute}
          videoRef={getSubstituteVideoRef()}
          rootRef={rootRef}
          onCollapseBtn={() => {
            getSubstituteVideoRef().pause();
            setIsHideVideoContainer(!isHideVideoContainer());
          }}
        />
      </div>
    );
  }, rootRef);
};

export const therealDanmakuFusionRender = (
  rootRef,
  videoRef,
) => render(() => (
  <DanmakuMigrate
    containerType={ContainerType.Thereal}
    videoRef={videoRef}
    rootRef={rootRef}
  />
), rootRef);
