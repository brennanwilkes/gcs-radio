import axios from "axios";
import "musickit-typescript/MusicKit";

/* eslint-disable no-undef */

let loaded = false;

const musicKitOnLoad = (resolve: (val: MusicKit.MusicKitInstance | PromiseLike<MusicKit.MusicKitInstance>) => void, reject: (err ?: any) => void) => {
	axios.post("../auth/musicKit").then(res => {
		if (res.data.token) {
			MusicKit.configure({
				developerToken: res.data.token,
				app: {
					name: "GCS Radio",
					build: "1978.4.1"
				}
			});
			loaded = true;
			resolve(MusicKit.getInstance());
		} else if (res.data.errors && res.data.errors.length > 0 && res.data.errors[0].message) {
			reject(new Error(res.data.errors[0].message));
		} else {
			reject(new Error("An error occurred retrieving developer token"));
		}
	}).catch(reject);
};

export default (): Promise<MusicKit.MusicKitInstance> => new Promise<MusicKit.MusicKitInstance>((resolve, reject) => {
	if (loaded) {
		resolve(MusicKit.getInstance());
	} else if (MusicKit) {
		musicKitOnLoad(resolve, reject);
	} else {
		document.addEventListener("musickitloaded", () => musicKitOnLoad(resolve, reject));
	}
});

/* eslint-enable no-undef */
