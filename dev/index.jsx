import { render } from "solid-js/web";
import { Route, HashRouter } from "@solidjs/router";
import Icon from './src/Icon';
import { Tab } from "./src/Component";
import Button from "./src/Button";
import TopDrawer from "./src/TopDrawer";
import Input from "./src/Input";
import Select from "./src/Select";
import Textarea from "./src/Textarea";
import HoverBlock from "./src/HoverBlock";
import TabPage from "./src/TabPage";
import Home from "./src/Home";
import { onMount } from "solid-js";
import ControlBar from "./src/ControlBar";
import DanmakuPool from "./src/DanmakuPool";
import DanmakuFusion from "./src/DanmakuFusion";

const styleWraperFactory = (hideWhat) => (Component) => () => {
  const display = (rest) => {
    document.querySelector('#danmaku-migrate-ext').style = `display: ${rest[0]}`;
    document.querySelector('#video-container').style = `display: ${rest[1]}`;
  };

  onMount(() => setTimeout(() => {
    switch (hideWhat) {
      case 'ext':
        display(['none', 'block']);
        break;
      case 'video':
        display(['block', 'none']);
        break;
      case 'all':
        display(['none', 'none']);
        break;
      case 'none':
        display(['block', 'block']);
        break;
    }
  }));
  return (<Component />)
}
const hideAll = styleWraperFactory('all');
const hideExt = styleWraperFactory('ext');
const unHide = styleWraperFactory('none');

const byproductRootRef = document.createElement('DIV');
byproductRootRef.setAttribute('id', 'byproduct-root');
document.body.appendChild(byproductRootRef);

const App = (props) => (
  <>
    <nav className="mt-4 flex flex-wrap">
      <Tab href="/">/</Tab>
      <Tab href="/home">/home</Tab>
      <Tab href="/icon">/icon</Tab>
      <Tab href="/button">/button</Tab>
      <Tab href="/input">/input</Tab>
      <Tab href="/select">/select</Tab>
      <Tab href="/textarea">/textarea</Tab>
      <Tab href="/top-drawer">/top-drawer</Tab>
      <Tab href="/hover-block">/hover-block</Tab>
      <Tab href="/tab-page">/tab-page</Tab>
      <Tab href="/controlbar">/control-bar</Tab>
      <Tab href="/danmaku-pool">/danmaku-pool</Tab>
      <Tab href="/danmaku-fusion">/danmaku-fusion</Tab>
    </nav>
    {props.children}
  </>
);

render(
  () => (
    <HashRouter root={App}>
      <Route path="/" component={unHide(() => <></>)} />
      <Route path="/home" component={hideAll(Home)} />
      <Route path="/icon" component={hideAll(Icon)} />
      <Route path="/button" component={hideAll(Button)} />
      <Route path="/top-drawer" component={hideAll(TopDrawer)} />
      <Route path="/hover-block" component={hideAll(HoverBlock)} />
      <Route path="/tab-page" component={hideAll(TabPage)} />
      <Route path="/input" component={hideAll(Input)} />
      <Route path="/select" component={hideAll(Select)} />
      <Route path="/textarea" component={hideAll(Textarea)} />
      <Route path="/controlbar" component={hideExt(ControlBar)} />
      <Route path="/danmaku-pool" component={hideExt(DanmakuPool)} />
      <Route path="/danmaku-fusion" component={hideExt(DanmakuFusion)} />
    </HashRouter>
  ),
  byproductRootRef
);
