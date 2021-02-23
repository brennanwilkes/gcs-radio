import * as React from "react";
import {Song} from '../../types/song';
import SongHowl from '../../types/songHowl';
import { FaRegPlayCircle, FaRegPauseCircle, FaStepForward, FaStepBackward } from 'react-icons/fa';
import {IconContext} from "react-icons";
import "./Player.css";
import { VoiceLineRender, VoiceLineType } from "../../types/voiceLine";
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
	seekLock: boolean,
	lastTransition: number,
	playedIntro: boolean
}

export default class App extends React.Component<IProps, IState> {

	constructor(props: IProps) {
		super(props);
		this.togglePause = this.togglePause.bind(this);
		this.transitionSong = this.transitionSong.bind(this);
		this.updateProgress = this.updateProgress.bind(this);
		this.setProgress = this.setProgress.bind(this);
		this.rewind = this.rewind.bind(this);
		this.initializeSongs = this.initializeSongs.bind(this);
		this.initializeTransitions = this.initializeTransitions.bind(this);

		this.state = {
			queue: [],
			transitions: [],
			paused: true,
			progress: 0,
			maxProgress: 0,
			index: 0,
			ready: false,
			seekLock: false,
			lastTransition: 0,
			playedIntro: false
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

	initializeSongs(){
		const queue: Howl[] = this.props.songs.map((song: Song) => new SongHowl(song));

		queue.forEach((audio,i) => {
			audio.on("end", () => this.transitionSong(1));
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

	initializeTransitions(){
		const transitions: Howl[] = this.props.transitions.map((voice: VoiceLineRender) => new SongHowl(voice));

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

	componentDidUpdate(prevProps: IProps){
		if(prevProps.songs !== this.props.songs){
			this.initializeSongs();
		}
		if(prevProps.transitions !== this.props.transitions){
			this.initializeTransitions();
		}
	}

	componentDidMount(){
		this.initializeSongs();
		this.initializeTransitions();
	}

	transitionSong(direction: number = 1){

		this.setState({seekLock: true});
		setTimeout(() => this.setState({seekLock: false}), 150);

		if(
			this.state.index + direction < this.state.queue.length &&
			this.state.index + direction < this.state.transitions.length &&
			this.state.index + direction >= 0){

			//Reset current audio
			this.state.queue[this.state.index].stop();
			this.state.transitions[this.state.lastTransition].stop();

			//Play transition audio
			if(!this.state.paused){
				if(this.state.index + direction >= 0){
					this.state.transitions[this.state.index + direction].play();
					this.setState({
						lastTransition : this.state.index + direction
					});
				}

				//Using the enum completely breaks webpack 5
				if(this.props.transitions[this.state.index + direction].type === "PARALLEL"){//VoiceLineType.parallel){
					this.state.queue[this.state.index + direction].play();
				}
				else{
					const indexCache = this.state.index + direction;
					this.state.transitions[this.state.index + direction].on("end",
						() => this.state.queue[indexCache].play()
					);
				}
			}
			this.setState({
				index: this.state.index + direction,
				maxProgress: this.state.queue[this.state.index + direction].duration()
			});
		}
		else{
			console.error("Can't transition to song!!");
			this.togglePause();
		}
	}

	rewind(){
		if(this.state.progress > 3 || this.state.index === 0){
			this.setProgress(0);
		}
		else{
			this.transitionSong(-1);
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
			if(!this.state.playedIntro){
				this.state.transitions[0].play();
				this.state.transitions[0].on("end", () => {
					this.state.queue[0].play();
				});
				this.setState({
					playedIntro: true
				});
			}
			else{
				if(this.state.transitions[this.state.index].playing()){
					this.state.transitions[this.state.index][this.state.paused ? "play" : "pause"]();
				}
				this.state.queue[this.state.index][this.state.paused ? "play" : "pause"]();
			}
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
					<div>
						<h2>{this.props.songs[this.state.index]?.title}</h2>
						<h4>{this.props.songs[this.state.index]?.artist}</h4>
					</div>
					<div>
						<button disabled={!this.state.ready} onClick={this.rewind}><FaStepBackward /></button>
						<button disabled={!this.state.ready} onClick={this.togglePause}>{
							this.state.paused ? <FaRegPlayCircle /> : <FaRegPauseCircle />
						}</button>
						<button disabled={!this.state.ready} onClick={() => this.transitionSong(1)}><FaStepForward /></button>
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
