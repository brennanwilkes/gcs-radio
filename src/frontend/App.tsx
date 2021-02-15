import * as React from "react";
import axios, { AxiosResponse } from "axios";
import {Song} from '../backend/types/song';
import Player from "./Player/Player";
import arrayShuffle from "array-shuffle";
import { VoiceLineRender } from "../backend/types/voiceLine";
//import $ from "jquery";

interface IProps {}
interface IState {
	songs: Song[],
	transitions: VoiceLineRender[]
}

export default class App extends React.Component<IProps, IState> {

	constructor(props: IProps) {
		super(props);

		this.state = {
			songs: [],
			transitions: []
		};
	}


	componentDidMount(){
		axios.get("/api/songs").then(res => {

			const songs: Song[] = arrayShuffle(res.data.songs);

			const transitions:Promise<AxiosResponse>[] = songs.map((song, i) => axios.post(`/api/voiceLines?prevId=${song.id}&nextId=${i+1 < songs.length ? songs[i+1].id : song.id}`));

			Promise.all(transitions).then(resps => {
				const converted: VoiceLineRender[] = resps.map(resp => resp.data.voiceLines[0]);
				this.setState({
					songs: songs,
					transitions: converted
				});
			});
		}).catch(console.error);
	}


	render(){
		return <>
			<div className="App">
				<h1>GCS Radio</h1>
				<Player songs={this.state.songs} transitions={this.state.transitions} />
			</div>
		</>
	}
}
