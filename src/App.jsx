import "./style.css";
import { onMount } from "solid-js";
import EntryBar from "./Components/EntryBar";

const App = () => {
  onMount(() => {
    document.documentElement.style = 'font-size: 16px;';
  });

  return (<EntryBar />);
};

export default App;
