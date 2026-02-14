import { Button, InlineButton, SimpleTooltip } from "../../src/Components/Common/Button";
import { Block, Page } from "./Component"

export default () => (
  <Page className="bg-blue-200">
    <InlineButton>行内按钮-1</InlineButton>
    <InlineButton>行内按钮-2</InlineButton>

    <Block className="overflow-visible">
      <SimpleTooltip className="ml-5" placement="bottom" content="SimpleTooltip SimpleTooltip">
        <InlineButton>Tooltip bottom</InlineButton>
      </SimpleTooltip>
      
      <SimpleTooltip className="ml-30" placement="bottom-right" content="SimpleTooltip SimpleTooltip">
        <InlineButton>Tooltip bottom-right</InlineButton>
      </SimpleTooltip>
    </Block>

    <Block>
      <div className="flex flex-row justify-end">
        <div className='bg-gray-900 py-3 pr-3 pl-5 rounded-s-full'>
          <Button>注入</Button>
          <Button>注入</Button>
          <Button>注入</Button>
        </div>
      </div>
    </Block>
  </Page>
);
