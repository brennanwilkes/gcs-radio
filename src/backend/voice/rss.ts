import axios from "axios";
import parser from "fast-xml-parser";

export interface Feed{
	url: string,
	name: string
}
interface RSSResponse{
	name: string,
	headline: string,
	details: string
}

export const feeds: Feed[] = [
	{ name: "BBC News", url: "http://feeds.bbci.co.uk/news/world/rss.xml" },
	{ name: "BBC Sports", url: "https://feeds.bbci.co.uk/sport/rss.xml" },
	{ name: "BBC Business", url: "http://feeds.bbci.co.uk/news/business/rss.xml" },
	{ name: "BBC Technology", url: "http://feeds.bbci.co.uk/news/technology/rss.xml" },
	{ name: "BBC Arts", url: "http://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml" },
	{ name: "Vancouver Weather", url: "https://weather.gc.ca/rss/city/bc-74_e.xml" },
	{ name: "CTV News", url: "https://bc.ctvnews.ca/rss/ctv-news-vancouver-1.822352" },
	{ name: "Vancouver Traffic", url: "https://www.drivebc.ca/api/events/region/mainland?format=rss" }
];

export const getFeed = (feed: Feed): Promise<RSSResponse[]> => {
	return new Promise<RSSResponse[]>((resolve, reject) => {
		axios.get(feed.url).then(res => {
			const channel: any = parser.parse(res.data)?.rss?.channel?.item;

			if (channel && "length" in channel && channel.length > 0 && "title" in channel[0] && "description" in channel[0]) {
				resolve(channel.map((item: any) => {
					return {
						name: feed.name,
						headline: item?.title ?? "UNKNOWN",
						details: item?.description ?? "UNKNOWN"
					};
				}));
			} else {
				reject(new Error("Feed returned invalid data"));
			}
		}).catch(reject);
	});
};

export const getRandomRSS = (): Promise<RSSResponse> => {
	return new Promise((resolve, reject) => {
		const feed = feeds[Math.floor(Math.random() * feeds.length)];
		getFeed(feed).then(responses => {
			resolve(responses[Math.floor(Math.random() * responses.length)]);
		}).catch(reject);
	});
};
