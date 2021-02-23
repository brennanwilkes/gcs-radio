const COOKIE = process.env.YTDL_COOKIE;

export default (COOKIE
	? {
		requestOptions: {
			headers: {
				Cookie: COOKIE
			}
		}
	}
	: {});
