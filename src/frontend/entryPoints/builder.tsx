// Brennan Wilkes

// Imports
import * as React from "react";
import * as ReactDOM from "react-dom";
import axios from "axios";

import Builder from "../Builder/Builder";
import "../scss/index.scss";

//https://stackoverflow.com/questions/9870512/how-to-obtain-the-query-string-from-the-current-url-with-javascript
const getQueryStringValue = (key: string): string  => decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));

const playlist = getQueryStringValue("playlist");

// Main render
ReactDOM.render(<Builder
	redirectCallback={(playlist: string) => {
		if(playlist && playlist.length > 0){
			window.open(`../app?playlist=${encodeURIComponent(playlist)}`);
		}
		axios.get("../auth").then(() => {
			window.location.href = `../dashboard`;
		}).catch(() => {
			window.location.href = `../`;
		});
	}}
	playlist={playlist} />, document.getElementsByTagName("MAIN")[0]);
