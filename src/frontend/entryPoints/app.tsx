// Brennan Wilkes

// Imports
import * as React from "react";
import * as ReactDOM from "react-dom";

//import Demo from "./Demo";
import ResponsiveContainer from "../ResponsiveContainer/ResponsiveContainer";
import App from "../App/App";

//https://stackoverflow.com/questions/9870512/how-to-obtain-the-query-string-from-the-current-url-with-javascript
const getQueryStringValue = (key: string): string  => decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));


// Main render
ReactDOM.render(<ResponsiveContainer children={<App playlist={getQueryStringValue("playlist") ?? "UNKNOWN"} />} />, document.getElementsByTagName("MAIN")[0]);
