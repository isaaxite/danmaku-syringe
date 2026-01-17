import { createSignal, Switch, Match } from "solid-js"
import { initDanmakuArea } from "../danmaku"
import "./styles/menu.css"

const btnDefClassList = "block w-full text-white px-3 py-2 rounded-sm";
const btnActClassList = "bg-blue-500 hover:bg-blue-700 cursor-pointer";
const btnDisableClassList = "bg-blue-300";

const Menu = () => {
  const [isDisableSelectVideoArea, setIsDisableSelectVideoArea] = createSignal(false);
  const [isDisableInsertDanmaku, setIsDisableInsertDanmaku] = createSignal(true);
  const [isDisableShiftDanmaku, setIsDisable3] = createSignal(true);

  const selectVideoAreahandler = () => {
    if (isDisableSelectVideoArea()) {
      return false;
    }

    setIsDisableSelectVideoArea(true);

    initDanmakuArea((xx) => {
      console.info(222, xx);
      setIsDisableInsertDanmaku(false);
    });
  };

  const insertDanmaku = () => {

  };

  const cloneDanmaku = () => {

  };

  return (
    <ul className="fixed top-10 right-2 bg-slate-50 px-2 py-3 shadow-md">
      <Switch>
        <Match when={isDisableShiftDanmaku()}>
          <li><button className={`${btnDefClassList} ${isDisableSelectVideoArea() ? btnDisableClassList : btnActClassList}`}  onClick={selectVideoAreahandler}>选择视频区域</button></li>
          <li><button className={`${btnDefClassList} mt-2 ${isDisableInsertDanmaku() ? btnDisableClassList : btnActClassList}`} onClick={insertDanmaku}>注入弹幕</button></li>
        </Match>
        <Match when={!isDisableShiftDanmaku()}>
          <li><button className={`${btnDefClassList} mt-2 ${isDisableShiftDanmaku() ? btnDisableClassList : btnActClassList}`} onClick={cloneDanmaku}>克隆弹幕</button></li>
        </Match>
      </Switch>
    </ul>
  );
};

export default Menu;
