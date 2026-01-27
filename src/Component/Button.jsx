export const InlineButton = (props) => {
  const btnDefClassList = "text-white px-2 py-1 rounded-sm mx-1 text-xs";
  const btnActClassList = "bg-blue-500 hover:bg-blue-700 cursor-pointer";

  return (
    <button {...props} className={`${btnDefClassList} mt-2 ${btnActClassList}`}>{props.children}</button>
  );
}
