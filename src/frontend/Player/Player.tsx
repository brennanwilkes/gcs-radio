import * as React from "react";
import {Song} from '../../backend/types/song';
import { FaRegPlayCircle, FaRegPauseCircle, FaStepForward, FaStepBackward } from 'react-icons/fa';
import {IconContext} from "react-icons";
import "./Player.css";
import { VoiceLineRender } from "../../backend/types/voiceLine";
import {Howl} from "howler";

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';


interface IProps {
	songs: Song[],
	transitions: VoiceLineRender[],
}
interface IState {
	paused: boolean,
	queue: Howl[],
	transitions: Howl[],
	progress: number,
	maxProgress: number,
	index: number,
	ready: boolean,
	seekLock: boolean
}

export default class App extends React.Component<IProps, IState> {

	constructor(props: IProps) {
		super(props);
		this.togglePause = this.togglePause.bind(this);
		this.transitionSong = this.transitionSong.bind(this);
		this.updateProgress = this.updateProgress.bind(this);
		this.setProgress = this.setProgress.bind(this);

		this.state = {
			queue: [],
			transitions: [],
			paused: true,
			progress: 0,
			maxProgress: 0,
			index: 0,
			ready: false,
			seekLock: false
		};

		setInterval(this.updateProgress, 1000);
	}

	updateProgress(){
		if(this.state.index < this.state.queue.length){
			const progress = this.state.queue[this.state.index].seek();
			if(typeof(progress) === "number"){
				this.setState({
					progress: progress
				});
			}
		}
	}

	componentDidUpdate(prevProps: IProps){
		if(prevProps.songs !== this.props.songs){
			const queue: Howl[] = this.props.songs.map(
				(song: Song) => new Howl({
					src: `/api/audio/${song?.audioId}`,
					format: ["mp3"],
					autoplay: false,
					preload: false
				})
			);

			queue.forEach((audio,i) => {
				audio.on("end", this.transitionSong);
				audio.on("load", () =>{
					if(i === 0){
						this.setState({
							ready: true,
							maxProgress: queue[0].duration()
						})
					}
					if(i + 1 < queue.length){
						console.log(`Loading song ${i + 1}/${queue.length - 1}`);
						queue[i + 1].load();
					}
				})
			});
			queue[0].load();

			this.setState({
				queue : queue,
			});
		}
		if(prevProps.transitions !== this.props.transitions){
			const transitions: Howl[] = this.props.transitions.map(
				(voice: VoiceLineRender) => new Howl({
					src: `/api/audio/${voice?.audioId}`,
					format: ["mp3"],
					autoplay: false,
					preload: false
			}));


			transitions.forEach((trans, i) => {
				trans.on("end", () => trans.stop());
				trans.on("load", () =>{
					if(i + 1 < transitions.length){
						console.log(`Loading transition ${i + 1}/${transitions.length - 1}`);
						transitions[i + 1].load();
					}
				})
			});
			transitions[0].load();

			this.setState({
				transitions : transitions,
			});
		}
	}

	transitionSong(){

		this.setState({seekLock: true});
		setTimeout(() => this.setState({seekLock: false}), 150);

		if(this.state.index + 1 < this.state.queue.length && this.state.index + 1 < this.state.transitions.length){

			//Reset current audio
			this.state.queue[this.state.index].stop();

			//Play transition audio
			if(!this.state.paused){
				this.state.transitions[this.state.index].play();
				this.state.queue[this.state.index + 1].play();
			}
			this.setState({
				index: this.state.index + 1,
				maxProgress: this.state.queue[this.state.index + 1].duration()
			});
		}
		else{
			console.error("Playlist empty!!");
			this.togglePause();
		}
	}

	setProgress(value: number){
		if(this.state.index < this.state.queue.length && !this.state.seekLock){
			this.state.queue[this.state.index].seek(value);
			this.updateProgress();
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
					<h4>{this.props.songs[this.state.index]?.artist}</h4>
					<div>
						<button disabled={!this.state.ready} onClick={() => this.setProgress(0)}><FaStepBackward /></button>
						<button disabled={!this.state.ready} onClick={this.togglePause}>{
							this.state.paused ? <FaRegPlayCircle /> : <FaRegPauseCircle />
						}</button>
						<button disabled={!this.state.ready} onClick={this.transitionSong}><FaStepForward /></button>
					</div>
					<Slider
						min={0}
						max={this.state.maxProgress}
						handleStyle={{
							display: "none"
						}}
						className="songProgressBar"
						value={this.state.progress}
						onChange={this.setProgress}
					/>
				</div>
			</IconContext.Provider>
		</>
	}
}
