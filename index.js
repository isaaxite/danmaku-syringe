import { render } from "solid-js/web"
import App from "./src/App";

const rootID = 'danmaku-migrate-ext';
const rootRef = document.createElement('DIV');
rootRef.setAttribute('id', rootID);
rootRef.classList = "absolute top-0 left-0 w-full overflow-visible z-1001";
document.body.appendChild(rootRef);

render(App, rootRef);
