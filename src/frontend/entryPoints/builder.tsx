// Brennan Wilkes

// Imports
import * as React from "react";
import * as ReactDOM from "react-dom";

import Builder from "../Builder/Builder";

//https://stackoverflow.com/questions/9870512/how-to-obtain-the-query-string-from-the-current-url-with-javascript
const getQueryStringValue = (key: string): string  => decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));

const playlist = getQueryStringValue("playlist");

// Main render
ReactDOM.render(<Builder
	redirectCallback={(playlist: string) => {
		window.location.href = playlist ? `../app?playlist=${encodeURIComponent(playlist)}` : `../dashboard`;
	}}
	playlist={playlist} />, document.getElementsByTagName("MAIN")[0]);
