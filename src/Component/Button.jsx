import { splitProps } from "solid-js";

export const InlineButton = (props) => {
  const [local, other] = splitProps(props, ['children']);
  const btnDefClassList = "text-white px-2 py-1 rounded-sm mx-1 text-xs";
  const btnActClassList = "bg-blue-500 hover:bg-blue-700 cursor-pointer";

  return (
    <button {...other} className={`${btnDefClassList} mt-2 ${btnActClassList}`}>{local.children}</button>
  );
}
