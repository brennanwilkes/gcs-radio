import axios from "axios";
import jscookie from "js-cookie";

type getOAuthTokenType = ((token: string) => void);

interface PlayerInstanceType{
	_options: {
		getOAuthToken: (callback: getOAuthTokenType) => void,
		id: string
	}
}

interface PlayerArg{
	spotify_uri: string,
	playerInstance: PlayerInstanceType
}

export const refresh_token = jscookie.get("srt") ?? "INVALID";

export const getAccessToken = (): Promise<string> => {
	return new Promise<string>((resolve, reject) => {
		if(refresh_token === "INVALID"){
			reject(new Error("Invalid refresh token"));
		}
		else{
			axios.patch(`../auth/spotify`,{
				refresh_token
			}).then(res => {
				if(res.data?.access_token){
					jscookie.set("sat", res.data.access_token);
					resolve(res.data.access_token);
				}
				else{
					reject(new Error("Invalid Access token"));
				}
			}).catch(reject);
		}
	});
};

const fireAndForgetAccessToken = (): Promise<string> => {
	return new Promise<string>((resolve, reject) => {
		getAccessToken().then(resolve).catch(console.error);
	});
}

export const playerSettings = {
	name: "GCS Radio",
	getOAuthToken: async (cb: getOAuthTokenType) => cb(await fireAndForgetAccessToken())
};

export const play = (args: PlayerArg) => {
	args.playerInstance._options.getOAuthToken((token: string) => {
		fetch(`https://api.spotify.com/v1/me/player/play?device_id=${args.playerInstance._options.id}`, {
			method: 'PUT',
			body: JSON.stringify({ uris: [args.spotify_uri] }),
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
		});
	});
}
