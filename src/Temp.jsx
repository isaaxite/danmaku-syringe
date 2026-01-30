import { EntertFullscreenIcon } from "./Component/Svg";
import "./style.css"
import { createSignal } from 'solid-js';

const App = () => {
  const [isExpand, setIsExpand] = createSignal(false);
  // console.log(getDanmakuData(1));

  return (
    <div className='absolute top-60 right-2 bg-slate-50 px-2 py-3 shadow-md z-9999'>
      <EntertFullscreenIcon />
    </div>
  );
};

export default App;