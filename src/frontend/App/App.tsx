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
	transitions: VoiceLineRender[],
	spotifySDKMode: boolean
}

export default class App extends React.Component<IProps, IState> {

	constructor(props: IProps) {
		super(props);
		this.updateVoice = this.updateVoice.bind(this);

		this.state = {
			songs: [],
			transitions: [],
			spotifySDKMode: false
		};
	}

	componentDidMount(){

		const voice = jscookie.get("voice");

		axios.get(`../api/v1/playlists/${encodeURIComponent(this.props.playlist)}`).then(resp => {

			const songs: Song[] = arrayShuffle(resp.data.playlists[0].songs);

			const transitions:Promise<AxiosResponse>[] = songs.map((song, i) => {
				if(i === 0){
					return axios.post(`/api/voiceLines?firstId=${song.id}${voice ? `&voice=${voice}` : "" }`);
				}
				else{
					return axios.post(`/api/voiceLines?prevId=${songs[i-1].id}&nextId=${song.id}${voice ? `&voice=${voice}` : "" }`);
				}
			});

			Promise.all(transitions).then(resps => {
				const converted: VoiceLineRender[] = resps.map(resp => resp.data.voiceLines[0]);

				const setStateSDK = (spotifySDKMode: boolean) => this.setState({
					songs: songs,
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
			window.location.href = "../builder";
		})
	}

	updateVoice(voice: string, label: string){
		const transitions:Promise<AxiosResponse>[] = this.state.songs.map((song, i) => {
			if(i === 0){
				return axios.post(`/api/voiceLines?firstId=${song.id}&voice=${voice}`);
			}
			else{
				return axios.post(`/api/voiceLines?prevId=${this.state.songs[i-1].id}&nextId=${song.id}&voice=${voice}`);
			}
		});

		Promise.all(transitions).then(resps => {
			const converted: VoiceLineRender[] = resps.map(resp => resp.data.voiceLines[0]);
			this.setState({
				transitions: converted
			});
			successResponseHandler(this)(`Updated Voice to ${label}`);
		}).catch(axiosErrorResponseHandler(this));


	}

	render(){
		return <>
			<div className="App bg-gcs-base">
				<h1>GCS Radio</h1>
				<Player
					updateVoice={this.updateVoice}
					spotifySDKMode={this.state.spotifySDKMode}
					songs={this.state.songs}
					transitions={this.state.transitions} />
			</div>
			<Response response={this.state} />
		</>
	}
}
