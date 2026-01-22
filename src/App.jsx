import { onMount } from "solid-js";
import "./style.css"
import Menu from "./Menu";

const App = () => {
  onMount(() => {
    document.body.style = "font-size: 16px;";
  });

  return (<Menu />);
};

export default App;
