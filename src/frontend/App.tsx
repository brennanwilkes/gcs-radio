import * as React from "react";
import axios, { AxiosResponse } from "axios";
import {Song} from '../types/song';
import Player from "./Player/Player";
import Builder from "./Builder/Builder";
import arrayShuffle from "array-shuffle";
import { VoiceLineRender } from "../types/voiceLine";
//import $ from "jquery";

enum AppMode {
	BUILDER,
	PLAYER
}

interface IProps {}
interface IState {
	songs: Song[],
	transitions: VoiceLineRender[],
	mode: AppMode
}

export default class App extends React.Component<IProps, IState> {

	constructor(props: IProps) {
		super(props);
		this.loadSongsFromBuilder = this.loadSongsFromBuilder.bind(this);

		this.state = {
			songs: [],
			transitions: [],
			mode: AppMode.BUILDER
		};
	}

	loadSongsFromBuilder(songsFromBuilder: Song[]){

		const songs: Song[] = arrayShuffle(songsFromBuilder);

		const transitions:Promise<AxiosResponse>[] = songs.map((song, i) => axios.post(`/api/voiceLines?prevId=${song.id}&nextId=${i+1 < songs.length ? songs[i+1].id : song.id}`));

		Promise.all(transitions).then(resps => {
			const converted: VoiceLineRender[] = resps.map(resp => resp.data.voiceLines[0]);
			this.setState({
				songs: songs,
				transitions: converted,
				mode: AppMode.PLAYER
			});
		});
	}

	render(){
		return <>
			<div className="App">
				<h1>GCS Radio</h1>
				{
					(this.state.mode === AppMode.BUILDER)
					? <Builder loadSongsCallback={this.loadSongsFromBuilder} />
					: <Player songs={this.state.songs} transitions={this.state.transitions} />
				}
			</div>
		</>
	}
}
