// Brennan Wilkes

// Imports
import * as React from "react";
import * as ReactDOM from "react-dom";

import ResponsiveContainer from "../ResponsiveContainer/ResponsiveContainer";
import Builder from "../Builder/Builder";

// Main render
ReactDOM.render(<ResponsiveContainer children={
	<Builder redirectCallback={(playlist: string) => {
		window.location.href = `../app?playlist=${encodeURIComponent(playlist)}`
	}} />
} />, document.getElementsByTagName("MAIN")[0]);
