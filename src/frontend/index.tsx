// Brennan Wilkes

// Imports
import * as React from "react";
import * as ReactDOM from "react-dom";

import Demo from "./Demo";
import ResponsiveContainer from "./ResponsiveContainer/ResponsiveContainer";
import App from "./App";
import Builder from "./builder/Builder";
import "./index.css";

// Main render
ReactDOM.render(<ResponsiveContainer children={<Builder />} />, document.getElementsByTagName("MAIN")[0]);
