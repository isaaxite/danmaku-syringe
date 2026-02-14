import { createSignal } from 'solid-js';
import { CollapseIcon, DanmakuToggleIcon, SyringeIcon, ToggleFullscreenIcon } from '../../src/Components/Common/Svg';
import { Block, InlineBlock, Page } from './Component';
import { PureButton } from '../../src/Components/Common/Button';


export default () => {
  const [isExpanded, setIsExpanded] = createSignal(false);
  const [dnamakuIsActive, setDnamakuIsActive] = createSignal(false)

  return (
    <Page>
      <PureButton className="p-1 rounded-sm mx-1"
        onClick={() => setIsExpanded(!isExpanded())}
      >
        <CollapseIcon isExpanded={isExpanded()} />
      </PureButton>
      <InlineBlock><ToggleFullscreenIcon /></InlineBlock>

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
