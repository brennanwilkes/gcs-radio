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


export const access_token = jscookie.get("sat") ?? "INVALID";
export const refresh_token = jscookie.get("srt") ?? "INVALID";

export const playerSettings = {
	name: "GCS Radio",
	getOAuthToken: (cb: getOAuthTokenType) => cb(access_token)
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
