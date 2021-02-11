import * as React from "react";
import axios from "axios";
import {Song} from '../backend/types/song';
import Player from "./Player/Player";
//import $ from "jquery";

interface IProps {}
interface IState {
	songs: Song[]
}

export default class App extends React.Component<IProps, IState> {

	constructor(props: IProps) {
		super(props);

		this.state = {
			songs: [],
		};
	}


	componentDidMount(){
		axios.get("/api/songs").then(res => {
			this.setState({
				songs: res.data.songs,
			});
		}).catch(console.error);
	}


	render(){
		return <>
			<h1>GCS Radio</h1>
			<Player songs={this.state.songs} />
		</>
	}
}
