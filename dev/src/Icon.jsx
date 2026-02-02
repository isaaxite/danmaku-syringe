import { createSignal } from 'solid-js';
import { InlineButton } from '../../src/Component/Button';
import { CollapseIcon, DanmakuToggleIcon, EntertFullscreenIcon, ExittFullscreenIcon, SyringeIcon } from '../../src/Component/Svg';
import { Block, InlineBlock, Page } from './Component';


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

      <InlineBlock><SyringeIcon class="size-6" /></InlineBlock>

      <Block>
        <div className='bg-gray-900 p-1.5 rounded-s-full'>
          <button className="rounded-full bg-amber-700 p-1">
            <SyringeIcon class="size-5" />
          </button>
        </div>
      </Block>
    </Page>
  );
};
