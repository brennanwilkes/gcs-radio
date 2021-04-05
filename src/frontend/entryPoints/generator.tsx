// Brennan Wilkes

// Imports
import * as React from "react";
import * as ReactDOM from "react-dom";

import Generator from "../Generator/Generator";
import "../scss/index.scss";
import Translator from "../Translator";

// Main render
ReactDOM.render(<Translator children={<Generator redirectCallback={(playlist: string) => {
		window.location.href = `../app?playlist=${encodeURIComponent(playlist)}`;
	}} />} />,document.getElementsByTagName("MAIN")[0]);
