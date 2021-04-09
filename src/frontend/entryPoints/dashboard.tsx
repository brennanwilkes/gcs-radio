// Brennan Wilkes

// Imports
import * as React from "react";
import * as ReactDOM from "react-dom";

import "../scss/index.scss";
import Dashboard from "../Dashboard/Dashboard";
import Translator from "../Translator";

import { logPage } from "../logger/logger";
logPage(window);

// Main render
ReactDOM.render(<Translator children={<Dashboard />} />,document.getElementsByTagName("MAIN")[0]);
