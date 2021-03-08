// Brennan Wilkes

// Imports
import * as React from "react";
import * as ReactDOM from "react-dom";

//import Demo from "./Demo";
import Builder from "../Builder/Builder";

// Main render
ReactDOM.render(<Builder redirectCallback={(playlist: string) => {
	window.location.href = `../app?playlist=${encodeURIComponent(playlist)}`
}} />,document.getElementsByTagName("MAIN")[0]);
