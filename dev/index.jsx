import { render } from "solid-js/web";
import { Route, HashRouter } from "@solidjs/router";
import Icon from './src/Icon';
import { Tab } from "./src/Component";
import Button from "./src/Button";
import TopDrawer from "./src/TopDrawer";
import Input from "./src/Input";
import Select from "./src/Select";
import Textarea from "./src/Textarea";

const byproductRootRef = document.createElement('DIV');
byproductRootRef.setAttribute('id', 'byproduct-root');
document.body.appendChild(byproductRootRef);

const App = (props) => (
  <>
    <nav className="mt-4">
      <Tab href="/">/home</Tab>
      <Tab href="/icon">/icon</Tab>
      <Tab href="/button">/button</Tab>
      <Tab href="/input">/input</Tab>
      <Tab href="/select">/select</Tab>
      <Tab href="/textarea">/textarea</Tab>
      <Tab href="/top-drawer">/top-drawer</Tab>
    </nav>
    {props.children}
  </>
);

render(
  () => (
    <HashRouter root={App}>
      <Route path="/icon" component={Icon} />
      <Route path="/button" component={Button} />
      <Route path="/top-drawer" component={TopDrawer} />
      <Route path="/input" component={Input} />
      <Route path="/select" component={Select} />
      <Route path="/textarea" component={Textarea} />
    </HashRouter>
  ),
  byproductRootRef
);
