import { CONFIG } from "../util/util";

export default (CONFIG.youtubeCookie
	? {
		requestOptions: {
			headers: {
				Cookie: CONFIG.youtubeCookie
			}
		}
	}
	: {});
