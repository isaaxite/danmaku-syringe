import { createSignal } from "solid-js";
import { Textarea } from "../../src/Components/Common/Textarea";
import { Block, Page } from "./Component";

export default () => {
  const [value, setValue] = createSignal('default text');
  return (
    <Page>
      <Block>
        <div>Textarea Content: {value()}</div>
        <Textarea value={value()} onChange={(val) => setValue(val)} />
      </Block>
    </Page>
  );
};
