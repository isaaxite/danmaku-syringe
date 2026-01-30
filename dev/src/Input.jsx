import { createSignal } from "solid-js";
import { Checkbox, TextInput, Upload } from "../../src/Component/Input";
import { Page, InlineBlock, Block } from "./Component";
import { InlineButton } from "../../src/Component/Button";

export default () => {
  const [text, setText] = createSignal('');
  const [selected, setSelected] = createSignal(false);

  return (
    <Page>
      <h2>Text Input</h2>
      <div className="mb-10">
        <InlineBlock>
          <TextInput placeholder="placeholder" />
        </InlineBlock>

        <InlineBlock><TextInput label="label:" /></InlineBlock>
        
        <Block>
          <div>current: {text()}</div>
          <TextInput value={text()} onChange={(value) => setText(value)} />
        </Block>
      </div>

      <h2>Checkbox</h2>
      <div className="mb-10">
        <InlineBlock><Checkbox checked={true} /></InlineBlock>
        <InlineBlock><Checkbox checked={false} /></InlineBlock>
        <InlineBlock><Checkbox label="checkbox label" checked={false} /></InlineBlock>
        <Block>
          <div>{selected() ? '已选中' : '未选中'}</div>
          <InlineButton onClick={() => setSelected(!selected())}>Toggle Selected</InlineButton>
          <Checkbox checked={selected()} />
        </Block>
      </div>

      <h2>Upload</h2>
      <div className="mb-10">
        <Upload onChange={(files) => console.info(files)} />
      </div>
    </Page>
  );
};
