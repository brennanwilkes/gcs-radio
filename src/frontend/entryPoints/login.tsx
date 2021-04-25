// Brennan Wilkes

import "../scss/index.scss";
import Login from "../Login/Login";
import Translator from "../Translator";

//https://stackoverflow.com/questions/9870512/how-to-obtain-the-query-string-from-the-current-url-with-javascript
const getQueryStringValue = (key: string): string  => decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));

import { logPage } from "../logger/logger";
logPage(window);

window.history.pushState({}, `${window.location.origin}${window.location.pathname}`);

// Main render
ReactDOM.render(<Translator children={<Login
    signup={getQueryStringValue("signup") ? true : false}
    verified={getQueryStringValue("verified") ? true : false} />} />, document.getElementsByTagName("MAIN")[0]);
