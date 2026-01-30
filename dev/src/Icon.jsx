import { createSignal } from 'solid-js';
import { InlineButton } from '../../src/Component/Button';
import { CollapseIcon, EntertFullscreenIcon, ExittFullscreenIcon } from '../../src/Component/Svg';
import { InlineBlock, Page } from './Component';


export default () => {
  const [isExpanded, setIsExpanded] = createSignal(false);

  return (
    <Page>
      <InlineButton onClick={() => setIsExpanded(!isExpanded())}><CollapseIcon isExpanded={isExpanded()} /></InlineButton>
      <InlineBlock><EntertFullscreenIcon /></InlineBlock>
      <InlineBlock><ExittFullscreenIcon /></InlineBlock>
    </Page>
  );
};
