import { onMount } from "solid-js";
import "./style.css"
import Entry from "./Entry";
// import Menu from "./Menu";

const App = () => {
  onMount(() => {
    document.body.style = "font-size: 16px;";
  });

  return (<Entry />);
};

export default App;
