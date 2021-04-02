// Brennan Wilkes

// Imports
import * as React from "react";
import * as ReactDOM from "react-dom";

import "../scss/index.scss";
import Landing from "../Landing/Landing";
import Translator from "../Translator";

// Main render
ReactDOM.render(<Translator children={<Landing />} />,document.getElementsByTagName("MAIN")[0]);
