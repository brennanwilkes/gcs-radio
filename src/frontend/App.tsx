import * as React from "react";
import axios from "axios";
import {Song} from '../backend/types/song';
import $ from "jquery";
import ReactPlayer from "react-player";

interface IProps {
}


interface IState {
	songs: Song[]
	currentSong: Song | undefined,
	paused: boolean
}


export default class App extends React.Component<IProps, IState> {

	constructor(props: IProps) {
		super(props);

		this.state = {
			songs: [],
			currentSong: undefined,
			paused: false
		};
	}


	componentDidMount(){
		axios.get("/api/songs").then(res => {
			console.dir(res.data);
			this.setState({
				songs: res.data.songs,
				currentSong: res.data.songs[Math.floor(Math.random() * res.data.songs.length)],
			});

			console.log(`/api/audio/${this.state.currentSong?.audioId}`);
			console.dir(ReactPlayer.canPlay(`/api/audio/${this.state.currentSong?.audioId}`));
			$("#aux").attr("src", `/api/audio/${this.state.currentSong?.audioId}`);

		}).catch(console.error);
	}

	render(){
		return <>
			<h1>GCS Radio</h1>
			<h2>Current Song: {this.state.currentSong?.title}</h2>
			<button onClick={event => this.setState({paused:!this.state.paused})}>{`Currently: ${this.state.paused}`}</button>
			<audio id="aux" controls></audio>
		</>
	}
}
/*<ReactPlayer
	url={[
		{src:`/api/audio/${this.state.currentSong?.audioId}`, type: "audio/mpeg"}
	]}
	playing={this.state.paused}
	controls={false}
	config={{
		file: {
			forceAudio:true
		}
	}}
	onReady={() => {
		console.dir("LOADED");
		this.setState({paused: true});
	}}
	onBuffer = {() => {
		console.dir("BUFFERING");
	}}
/>*/
