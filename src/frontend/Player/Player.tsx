import * as React from "react";
import {Song} from '../../backend/types/song';
import { FaRegPlayCircle, FaRegPauseCircle } from 'react-icons/fa';
import {IconContext} from "react-icons";
import "./Player.css";
import { VoiceLineRender } from "../../backend/types/voiceLine";
import {Howl} from "howler";

interface IProps {
	songs: Song[],
	transitions: VoiceLineRender[],
}
interface IState {
	paused: boolean,
	queue: Howl[],
	transitions: Howl[],
	progress: number,
	index: number,
	ready: boolean
}

export default class App extends React.Component<IProps, IState> {

	constructor(props: IProps) {
		super(props);
		this.togglePause = this.togglePause.bind(this);
		this.transitionSong = this.transitionSong.bind(this);

		this.state = {
			queue: [],
			transitions: [],
			paused: true,
			progress: 0,
			index: 0,
			ready: false
		};
	}



	componentDidUpdate(prevProps: IProps){
		if(prevProps.songs !== this.props.songs){
			console.log("DIFF SONGS")
			const queue: Howl[] = this.props.songs.map(
				(song: Song) => new Howl({
					src: `/api/audio/${song?.audioId}`,
					format: ["mp3"]
			}));

			queue.forEach(audio => {
				audio.on("end", this.transitionSong);
				/*audio.ontimeupdate = () => this.setState({progress: Math.floor(audio.currentTime)});
				audio.onended = this.transitionSong;
				audio.preload = "auto";*/
			});

			if(queue.length >= 1){
				queue[0].once("load", () => this.setState({ready:true}));
			}

			this.setState({
				queue : queue,
			});
		}
		if(prevProps.transitions !== this.props.transitions){
			console.log("DIFF TRANS")
			const transitions: Howl[] = this.props.transitions.map(
				(voice: VoiceLineRender) => new Howl({
					src: `/api/audio/${voice?.audioId}`,
					format: ["mp3"]
			}));

			transitions.forEach(audio => {
				audio.on("end", () => audio.stop());
			});

			this.setState({
				transitions : transitions,
			});
		}
	}

	transitionSong(){
		if(this.state.index + 1 < this.state.queue.length && this.state.index + 1 < this.state.transitions.length){

			//Reset current audio
			this.state.queue[this.state.index].stop();


			//Play transition audio
			this.state.transitions[this.state.index].play();
			this.state.queue[this.state.index + 1].play();
			this.setState({index: this.state.index + 1});
			
		}
		else{
			console.error("Playlist empty!!");
			this.togglePause();
		}
	}

	togglePause(){
		if(this.state.queue[this.state.index]){
			if(this.state.index - 1 >= 0 && this.state.transitions[this.state.index - 1].playing()){
				this.state.transitions[this.state.index - 1][this.state.paused ? "play" : "pause"]();
			}
			this.state.queue[this.state.index][this.state.paused ? "play" : "pause"]();
		}
		this.setState({paused: !this.state.paused});
	}

	render(){
		return <>
			<IconContext.Provider value={{
				size: "50",
				className: "react-icon"
			}}>
				<div className="Player">
				<img src={this.props.songs[this.state.index]?.thumbnailUrl} />
				<h2>{this.props.songs[this.state.index]?.title}</h2>
				<button disabled={!this.state.ready} onClick={this.togglePause}>{
					this.state.paused ? <FaRegPlayCircle /> : <FaRegPauseCircle />
				}</button>
				<button onClick={this.transitionSong}>{
					`Currently: ${this.state.progress}s / ${Math.floor(this.props.songs[this.state.index]?.duration / 1000)}s`
				}</button>
				</div>
			</IconContext.Provider>
		</>
	}
}
