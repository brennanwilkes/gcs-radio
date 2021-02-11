import * as React from "react";
import {Song} from '../../backend/types/song';
import { FaRegPlayCircle, FaRegPauseCircle } from 'react-icons/fa';
import {IconContext} from "react-icons";
import "./Player.css";

interface IProps {
	songs: Song[],
}
interface IState {
	paused: boolean,
	queue: HTMLAudioElement[],
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
			paused: true,
			progress: 0,
			index: 0,
			ready: false
		};
	}



	componentDidUpdate(prevProps: IProps){
		if(prevProps !== this.props){
			const queue: HTMLAudioElement[] = this.props.songs.map((song: Song) => new Audio(`/api/audio/${song?.audioId}`));
			queue.forEach(audio => {
				audio.ontimeupdate = () => this.setState({progress: Math.floor(audio.currentTime)});
				audio.onended = this.transitionSong;
			});
			queue[0].oncanplay = () => this.setState({ready:true});

			this.setState({
				queue : queue,
			});
		}
	}

	transitionSong(){
		if(this.state.index + 1 < this.state.queue.length){
			this.state.queue[this.state.index].pause();
			this.state.queue[this.state.index].currentTime = 0;

			this.state.queue[this.state.index + 1].currentTime = 0;
			this.state.queue[this.state.index + 1].play();

			this.setState({index: this.state.index + 1})
		}
		else{
			console.error("Playlist empty!!");
			this.togglePause();
		}
	}

	togglePause(){
		if(this.state.queue[this.state.index]){
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
