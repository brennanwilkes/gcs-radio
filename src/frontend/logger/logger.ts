import * as ReactGA from "react-ga";
import { createBrowserHistory } from "history";
import analyticsConfig from "../../config/analytics";

ReactGA.initialize(analyticsConfig.googleTrackingId);
createBrowserHistory().listen(location => {
	ReactGA.pageview(location.pathname);
});

export const logPage = (window: Window) => {
	ReactGA.pageview(window.location.pathname);
};
