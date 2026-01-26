import { createSignal } from "solid-js";
import { Show, Switch, Match, render } from "solid-js/web";
import DanmakuMigrate from "./DanmakuMigrate/Index";

const DisplayState = {
  Hide: 'hide',
  Expand: 'expand',
  Collapse: 'collapse'
};

const ContainerType = {
  Substitute: 'substitute'
};

const Entry = () => {
  const [getDisplayState, setDisplayState] = createSignal(DisplayState.Expand);
  const [getContainerType, setContainerType] = createSignal(ContainerType.Substitute);
  const [getOriginVideoSrc, setOriginVideoSrc] = createSignal('');

  const queryOriginVideoSrc = () => {
    const videoRef = document.querySelector('video');

    return videoRef ? videoRef.getAttribute('src') : '';
  };

  const appendContainer = () => {
    if (!getOriginVideoSrc()) {
      return;
    }

    const containerRef = document.createElement('DIV');
    containerRef.setAttribute('id', 'danmaku-migrate-container');
    containerRef.classList = 'absolute top-0 bottom-0 left-0 w-full z-1000';
    document.body.appendChild(containerRef);

    setDisplayState(DisplayState.Hide);

    render(() => (<DanmakuMigrate videoSrc={getOriginVideoSrc()} containerRef={containerRef}/>), containerRef);
  };

  return (
    <div id="danmaku-migrate-entry" className="alsolute top-0 left-0 w-full flex justify-end z-1000">
      <Show when={getDisplayState() !== DisplayState.Hide}>
        <Switch>
          <Match when={getDisplayState() === DisplayState.Expand}>
            <div className="wrap w-full flex justify-end bg-neutral-600 py-1">
              <select className="text-white bg-blue-500 cursor-pointer" onChange={(e) => setContainerType(e.target.value)}>
                <option value={ContainerType.Substitute}>替身容器</option>
              </select>
              <Switch>
                <Match when={getContainerType() === ContainerType.Substitute}>
                  <button className="text-white bg-blue-500 cursor-pointer" onClick={() => {
                    const videoSrc = queryOriginVideoSrc();
                    if (!videoSrc) {
                      console.info('Can not find any video src!');
                      return;
                    }
                    setOriginVideoSrc(videoSrc);
                  }}>获取视频源</button>
                  <button onClick={appendContainer} className="text-white bg-blue-500 cursor-pointer">创建</button>
                </Match>
              </Switch>
              <button className="bg-slate-800 text-white" onClick={() => setDisplayState(DisplayState.Collapse)}>收起</button>
            </div>
          </Match>
          <Match when={getDisplayState() === DisplayState.Collapse}>
            <button className="bg-slate-800 text-white" onClick={() => setDisplayState(DisplayState.Expand)}>展开</button>
          </Match>
        </Switch>
      </Show>
    </div>
  );
};

export default Entry;
