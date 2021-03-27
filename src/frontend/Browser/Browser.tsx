import * as React from "react";
import axios from "axios";
import "./browser.css";

import Navbar from "../Navbar/Navbar";
import { Playlist } from "../../types/playlist";

interface IProps {}
interface IState {
	playlists: Playlist[],
}

export default class Browser extends React.Component<IProps, IState> {

	constructor(props: IProps) {
		super(props);

		this.state = {
			playlists: []
		}
	}

	componentDidMount(){
		axios.get("/api/v1/playlists?isNamed=1&noRender=1").then(resp => {
			this.setState({
				playlists: resp.data.playlists.filter((p:Playlist) => !!p.details)
			});
		}).catch(console.error);
	}


	render(){
		return <>
            <Navbar />
			<div className="Browser">
				<ul>{
					this.state.playlists.map(playlist => <li key={playlist.id}><a href={`../app?playlist=${encodeURIComponent(playlist.id ?? "")}`}>{playlist.details?.name}</a></li>)
				}</ul>
			</div>
		</>
	}
}
