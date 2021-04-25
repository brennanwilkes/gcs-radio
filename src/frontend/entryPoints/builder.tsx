// Brennan Wilkes

import Builder from "../Builder/Builder";
import "../scss/index.scss";
import Translator from "../Translator";

import { logPage } from "../logger/logger";
logPage(window);

//https://stackoverflow.com/questions/9870512/how-to-obtain-the-query-string-from-the-current-url-with-javascript
const getQueryStringValue = (key: string): string  => decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));

const playlist = getQueryStringValue("playlist");

// Main render
ReactDOM.render(<Translator children={<Builder redirectCallback={(playlist: string) => {
		window.location.href = `../app?playlist=${encodeURIComponent(playlist)}`;
	}}
	playlist={playlist} />} />,document.getElementsByTagName("MAIN")[0]);
