import { onMount } from "solid-js";
import "./style.css"
// import Entry from "./Entry";
import EntryBar from "./EntryBar";
// import Menu from "./Menu";

const App = () => {
  onMount(() => {
    document.documentElement.style = 'font-size: 16px;';
  });

  return (<EntryBar />);
};

export default App;
