import * as React from "react";
import axiosPure, { AxiosResponse } from "axios";
import rateLimit from "axios-rate-limit";
const axios = rateLimit(axiosPure.create(), { maxRequests: 5, perMilliseconds: 1000 });

import {Song} from '../../types/song';
import Player from "../Player/Player";
import arrayShuffle from "array-shuffle";
import jscookie from "js-cookie";
import { VoiceLineRender } from "../../types/voiceLine";
import { getAccessToken } from "../spotifyWebSDK/spotifyWebSDK";
import "./app.scss";
import Response, {HasResponse, axiosErrorResponseHandler, successResponseHandler} from "../Response/Response";

interface IProps {
	playlist: string
}
interface IState extends HasResponse{
	songs: Song[],
	limitedSongs: Song[],
	transitions: VoiceLineRender[],
	spotifySDKMode: boolean,
	processing: boolean
}

export default class App extends React.Component<IProps, IState> {

	constructor(props: IProps) {
		super(props);
		this.updateVoice = this.updateVoice.bind(this);
		this.requestMoreSongs = this.requestMoreSongs.bind(this);
		this.getVoiceLines = this.getVoiceLines.bind(this);

		this.state = {
			songs: [],
			limitedSongs: [],
			transitions: [],
			spotifySDKMode: false,
			processing: false
		};
	}

	getVoiceLines(songs: Song[], lastSong?: Song, voice: string | undefined = jscookie.get("voice")): Promise<VoiceLineRender[]>{
		return new Promise<VoiceLineRender[]>((resolve, reject) => {

			successResponseHandler(this)(`Requesting ${songs.length} voice lines`);
			Promise.all(songs.map((song, i) => {
				return axios.post(`/api/voiceLines?${
					(!lastSong) && i === 0 ? `firstId=${song.id}` : `prevId=${(i === 0 && lastSong) ? lastSong.id : songs[i-1].id}&nextId=${song.id}`
				}${voice ? `&voice=${voice}` : "" }&playlist=${encodeURIComponent(this.props.playlist)}`).catch(err => {
					axiosErrorResponseHandler(this)(err);
					return err;
				})
			})).then(resps => {
				const converted: VoiceLineRender[] = resps.map(resp => resp.data.voiceLines[0]);
				resolve(converted);
			}).catch(reject);
		});
	}


	componentDidMount(){

		axios.get(`../api/v1/playlists/${encodeURIComponent(this.props.playlist)}`).then(resp => {
			const songs: Song[] = arrayShuffle(resp.data.playlists[0].songs);

			this.getVoiceLines(songs.slice(0,10)).then(converted => {

				const setStateSDK = (spotifySDKMode: boolean) => this.setState({
					songs: songs,
					limitedSongs: songs.slice(0,10),
					transitions: converted,
					spotifySDKMode
				});

				getAccessToken().then(() => {
					setStateSDK(true);
				}).catch(() => {
					setStateSDK(false);
				});
			}).catch(axiosErrorResponseHandler(this));
		}).catch(() => {
			window.location.href = "../build";
		})
	}

	updateVoice(voice: string, label: string, index: number = 0){
		this.getVoiceLines(this.state.limitedSongs.slice(index), undefined, voice).then(converted => {
			this.setState({
				transitions: [...this.state.transitions.slice(0, index), ...converted]
			});
			successResponseHandler(this)(`Updated Voice to ${label}`);
		}).catch(axiosErrorResponseHandler(this));
	}

	requestMoreSongs(limit: number){
		if(this.state.processing){
			return;
		}
		this.setState({
			processing: true
		});

		let nextSongs = this.state.songs.slice(this.state.limitedSongs.length,this.state.limitedSongs.length + limit);
		if(nextSongs.length < limit){
			axios.post(`../api/v1/songs/next?playlist=${encodeURIComponent(this.props.playlist)}&limit=${limit - nextSongs.length}`).then(resp => {
				const recoSongs: Song[] = arrayShuffle(resp.data.songs);
				nextSongs = [...nextSongs, ...recoSongs];

				this.getVoiceLines(nextSongs, this.state.limitedSongs.slice(-1)[0]).then(converted => {
					this.setState({
						songs: [...this.state.songs, ...recoSongs],
						limitedSongs : [...this.state.limitedSongs, ...nextSongs],
						transitions : [...this.state.transitions, ...converted],
						processing: false
					});
				}).catch(axiosErrorResponseHandler(this));
			}).catch(axiosErrorResponseHandler(this));
		}
		else{
			this.getVoiceLines(nextSongs, this.state.limitedSongs.slice(-1)[0]).then(converted => {
				this.setState({
					limitedSongs : [...this.state.limitedSongs, ...nextSongs],
					transitions : [...this.state.transitions, ...converted],
					processing: false
				});
			}).catch(axiosErrorResponseHandler(this));
		}
	}

	render(){
		return <>
			<div className="App bg-gcs-base">
				<h1 onClick={() => window.location.href = ".."}>GCS Radio</h1>
				<Player
					requestMoreSongs={this.requestMoreSongs}
					updateVoice={this.updateVoice}
					spotifySDKMode={this.state.spotifySDKMode}
					songs={this.state.limitedSongs}
					transitions={this.state.transitions} />
			</div>
			<Response response={this.state} />
		</>
	}
}
