import { render } from "solid-js/web"
// import App from "./src/Temp";
import App from "./src/App";

// render(App, document.getElementById('root'));
const rootID = 'danmaku-migrate_root';
const rootRef = document.createElement('DIV');
rootRef.setAttribute('id', rootID);
rootRef.classList = "absolute top-0 left-0 w-full overflow-visible z-1001";
document.body.appendChild(rootRef);

setTimeout(() => {
  render(App, rootRef);
}, 100);
