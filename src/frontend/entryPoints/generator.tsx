// Brennan Wilkes

import Generator from "../Generator/Generator";
import "../scss/index.scss";
import Translator from "../Translator";

import { logPage } from "../logger/logger";
logPage(window);

// Main render
ReactDOM.render(<Translator children={<Generator redirectCallback={(playlist: string) => {
		window.location.href = `../app?playlist=${encodeURIComponent(playlist)}`;
	}} />} />,document.getElementsByTagName("MAIN")[0]);
