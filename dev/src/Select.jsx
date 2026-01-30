import { createSignal } from "solid-js";
import { DropdownMenu } from "../../src/Component/Select";
import { Page } from "./Component";

export default () => {
  const [selected, setSelected]= createSignal('options-value-2')

  return (
    <Page>
      <div>Selected Option Value: {selected()}</div>
      <DropdownMenu
        options={[
          { text: 'options-1', value: 'options-value-1' },
          { text: 'options-2', value: 'options-value-2' },
          { text: 'options-3', value: 'options-value-3' },
        ]}
        selected={selected()}
        onChange={(value) => setSelected(value)}
      />
    </Page>
  );
};
