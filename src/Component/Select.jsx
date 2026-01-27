import { createSignal, Index } from "solid-js";

export const DropdownMenu = (props) => {
  const getOpts = () => props.options;
  const [selected, setSelected] = createSignal(props.selected || getOpts()[0].value);

  return (
    <select
      className="text-xs text-white bg-blue-500 cursor-pointer h-6 rounded px-2 mt-2 mx-1 hover:bg-blue-700"
      onChange={(e) => {
        props.onChange && props.onChange(e.target.value);
        setSelected(e.target.value);
      }}
    >

      <Index each={getOpts()}>
        {(item, index) => (
          <option
            className="text-xs cursor-pointer"
            value={item().value}
            selected={selected() === item().value}
          >{item().text}</option>
        )}
      </Index>
    </select>
  );
};
