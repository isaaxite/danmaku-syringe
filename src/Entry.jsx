import { createSignal } from "solid-js";
import { Show, Switch, Match, render } from "solid-js/web";
import DanmakuMigrate from "./DanmakuMigrate/Index";
import VideoContainer from "./VideoContainer";
import { InlineButton } from "./Component/Button";
import { DropdownMenu } from "./Component/Select";

const DisplayState = {
  Hide: 'hide',
  Expand: 'expand',
  Collapse: 'collapse'
};

const ContainerType = {
  Substitute: 'substitute',
  Thereal: 'thereal',
};

const Entry = () => {
  const [getDisplayState, setDisplayState] = createSignal(DisplayState.Expand);
  const [getContainerType, setContainerType] = createSignal(ContainerType.Thereal);
  const [getOriginVideoSrc, setOriginVideoSrc] = createSignal('');
  const [getTherealRootPath, setTherealRootPath] = createSignal('#video-container');
  const [isHideVideoContainer, setIsHideVideoContainer] = createSignal(false);

  const queryOriginVideoSrc = () => {
    const videoRef = document.querySelector('video');

    return videoRef ? videoRef.getAttribute('src') : '';
  };

  const appendSubstituteRoot = () => {
    if (!getOriginVideoSrc()) {
      return;
    }

    const rootRef = document.createElement('DIV');
    rootRef.setAttribute('id', 'danmaku-migrate_substitute-root');
    rootRef.classList = 'absolute top-0 bottom-0 left-0 w-full z-1000';
    rootRef.style = 'pointer-events: none;';
    document.body.appendChild(rootRef);

    setDisplayState(DisplayState.Hide);

    render(() => {
      const [getSubstituteVideoRef, setSubstituteVideoRef] = createSignal(null);
      return (
        <div
          className={`${isHideVideoContainer() ? '-translate-y-full' : ''} bg-black absolute top-0 bottom-0 left-0 w-full z-1000`}
          style="pointer-events: auto;"
        >
          <VideoContainer
            ref={setSubstituteVideoRef}
            src={getOriginVideoSrc()}
          />
          <DanmakuMigrate
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

  const appendDanmakuContainer = () => {
    const rootRef = document.querySelector(getTherealRootPath());
    if (!rootRef) {
      console.info(`Using ${getTherealRootPath()} can not find any html elements!`);
      return;
    }

    const videoRef = document.querySelector('video');
    // const containerRef = document.createElement('DIV');
    // containerRef.setAttribute('id', 'danmaku-migrate_container');
    // containerRef.classList = 'absolute top-0 bottom-0 left-0 w-full z-1000';
    // rootRef.appendChild(containerRef);
    render(() => (<DanmakuMigrate videoRef={videoRef} rootRef={rootRef} />), rootRef);

    setDisplayState(DisplayState.Hide);
  };

  return (
    <div id="danmaku-migrate-entry" className="alsolute top-0 left-0 w-full flex justify-end z-1000">
      <Show when={getDisplayState() !== DisplayState.Hide}>
        <Switch>
          <Match when={getDisplayState() === DisplayState.Expand}>
            <div className="wrap flex justify-end bg-white px-2 pb-2 rounded-l">
              <DropdownMenu
                selected={getContainerType()}
                options={[
                  { text: '替身容器', value: ContainerType.Substitute },
                  { text: '真身容器', value: ContainerType.Thereal },
                ]}
                onChange={(value) => setContainerType(value)}
              />
              <Switch>
                <Match when={getContainerType() === ContainerType.Substitute}>
                  <InlineButton onClick={() => {
                    const videoSrc = queryOriginVideoSrc();
                    if (!videoSrc) {
                      console.info('Can not find any video src!');
                      return;
                    }
                    setOriginVideoSrc(videoSrc);
                  }}>获取视频源</InlineButton>
                  <Show when={!!getOriginVideoSrc()}>
                    <InlineButton onClick={appendSubstituteRoot}>创建</InlineButton>
                  </Show>
                </Match>
                <Match when={getContainerType() === ContainerType.Thereal}>
                  <input type="text" value={getTherealRootPath()} onChange={(e) => setTherealRootPath(e.target.value)} />
                  <InlineButton onClick={appendDanmakuContainer}>注入</InlineButton>
                </Match>
              </Switch>
              <InlineButton onClick={() => setDisplayState(DisplayState.Collapse)}>收起</InlineButton>
            </div>
          </Match>
          <Match when={getDisplayState() === DisplayState.Collapse}>
            <InlineButton onClick={() => setDisplayState(DisplayState.Expand)}>展开</InlineButton>
          </Match>
        </Switch>
      </Show>

      <Show when={isHideVideoContainer()}>
        <InlineButton
          onClick={() => setIsHideVideoContainer(!isHideVideoContainer())}
        >展开</InlineButton>
      </Show>
    </div>
  );
};

export default Entry;
