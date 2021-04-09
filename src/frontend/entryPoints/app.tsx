// Brennan Wilkes

// Imports
import * as React from "react";
import * as ReactDOM from "react-dom";

import ResponsiveContainer from "../ResponsiveContainer/ResponsiveContainer";
import App from "../App/App";
import "../scss/index.scss";
import Translator from "../Translator";

import { logPage } from "../logger/logger";
logPage(window);

//https://stackoverflow.com/questions/9870512/how-to-obtain-the-query-string-from-the-current-url-with-javascript
const getQueryStringValue = (key: string): string  => decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));

const playlist = getQueryStringValue("playlist") ?? "UNKNOWN";


// Main render
ReactDOM.render(<Translator children={<ResponsiveContainer
    children={<App playlist={playlist} />} />
} />, document.getElementsByTagName("MAIN")[0]);
