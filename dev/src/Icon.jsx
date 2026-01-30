import { createSignal } from 'solid-js';
import { InlineButton } from '../../src/Component/Button';
import { CollapseIcon, DanmakuToggleIcon, EntertFullscreenIcon, ExittFullscreenIcon } from '../../src/Component/Svg';
import { InlineBlock, Page } from './Component';


export default () => {
  const [isExpanded, setIsExpanded] = createSignal(false);
  const [dnamakuIsActive, setDnamakuIsActive] = createSignal(false)

  return (
    <Page>
      <button className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded())}><CollapseIcon isExpanded={isExpanded()} /></button>
      <InlineBlock><EntertFullscreenIcon /></InlineBlock>
      <InlineBlock><ExittFullscreenIcon /></InlineBlock>

      <InlineBlock>
        <button className="cursor-pointer" onClick={() => setDnamakuIsActive(!dnamakuIsActive())}>
          <DanmakuToggleIcon active={dnamakuIsActive()} />
        </button>
      </InlineBlock>
    </Page>
  );
};
