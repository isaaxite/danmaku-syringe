import { createSignal } from "solid-js";
import { EntryBarLogic } from "./Logic";
import { EntryBarView } from "./View";

export default () => {
  const [isDestroy, setIsDestroy] = createSignal(false);
  const { onClickApplyBtn } = EntryBarLogic();

  return (
    <>
      {isDestroy() ? (<></>) : (
        <EntryBarView onClickApplyBtn={(...rest) => {
          const ret = onClickApplyBtn(...rest);
          if (ret && !ret.isFail) {
            setIsDestroy(true);
          }
          return ret;
        }} />
      )}
    </>
  );
};
