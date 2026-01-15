import { initDanmakuArea } from "../danmaku"

const Menu = () => {
  const selectVideoAreahandler = () => {
    initDanmakuArea((xx) => {
      console.info(222, xx)
    });
  };

  const insertDanmaku = () => {

  };

  const pushDanmaku = () => {

  };

  return (
    <ul>
      <li><button onClick={selectVideoAreahandler}>选择视频区域</button></li>
      <li><button onClick={insertDanmaku}>注入弹幕</button></li>
      <li><button onClick={pushDanmaku}>添加弹幕</button></li>
    </ul>
  );
};

export default Menu;
