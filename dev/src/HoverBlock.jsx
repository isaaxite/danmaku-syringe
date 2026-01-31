import { createSignal } from "solid-js";
import { HoverBlock } from "../../src/Component/HoverBlock";
import { Page } from "./Component";
import { InlineButton } from "../../src/Component/Button";

const BorderBox = (props) => {
  return (
    <div className={`align-top box-border w-1/3 h-40 inline-block border-blue-500 border-1 text-center ${props.className || ''}`}>{props.children}</div>
  );
}

export default () => {
  const [forceVisible, setforceVisible] = createSignal(true);
  return (
    <Page>
      <HoverBlock className="w-full min-h-40 box-border" forceVisible={forceVisible()}>
        <BorderBox />
        <BorderBox className="w-1/3 h-40 inline-block">
          <InlineButton onClick={() => setforceVisible(!forceVisible())}>forceVisible: {forceVisible() ? 'true' : 'false'}</InlineButton>
        </BorderBox>
        <BorderBox />
      </HoverBlock>
    </Page>
  );
};
