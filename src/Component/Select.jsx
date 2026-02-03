import { createSignal, Index } from "solid-js";
import { PRIMARY_CLASSNAMES, PRIMARY_FONTSIZE } from "../constant";

export const DropdownMenu = (props) => {
  const getOpts = () => props.options;
  const [selected, setSelected] = createSignal(props.selected || getOpts()[0].value);

  return (
    <select
      className={`${PRIMARY_CLASSNAMES} cursor-pointer h-6 rounded px-2 mx-1`}
      onChange={(e) => {
        props.onChange && props.onChange(e.target.value);
        setSelected(e.target.value);
      }}
    >

      <Index each={getOpts()}>
        {(item) => (
          <option
            className={`${PRIMARY_FONTSIZE} cursor-pointer`}
            value={item().value}
            selected={selected() === item().value}
          >{item().text}</option>
        )}
      </Index>
    </select>
  );
};
