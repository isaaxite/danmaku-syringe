import { InlineButton, SimpleTooltip } from "../../src/Component/Button";
import { Block, Page } from "./Component";

export default () => (
  <Page>
    <InlineButton>行内按钮-1</InlineButton>
    <InlineButton>行内按钮-2</InlineButton>

    <Block>
      <SimpleTooltip className="ml-5" placement="bottom" content="SimpleTooltip SimpleTooltip">
        <InlineButton>Tooltip bottom</InlineButton>
      </SimpleTooltip>
      
      <SimpleTooltip className="ml-30" placement="bottom-right" content="SimpleTooltip SimpleTooltip">
        <InlineButton>Tooltip bottom-right</InlineButton>
      </SimpleTooltip>
    </Block>
  </Page>
);
