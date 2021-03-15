import * as React from "react";
import axios from "axios";
import {Playlist} from "../../types/playlist";
import {User} from "../../types/user";
import jscookie from "js-cookie";

import "./dashboard.css";

interface IProps {}
interface IState {
	playlists: Playlist[],
	user?: User
}

export default class Dashboard extends React.Component<IProps, IState> {

	constructor(props: IProps){
		super(props);

		this.state = {
			playlists: []
		}
	}

	componentDidMount(){
		axios.get("/auth").then(resp => {
			this.setState({
				user: resp.data.users[0]
			});

			axios.get("/api/v1/playlists").then(resp2 => {
				this.setState({
					playlists: resp2.data.playlists.filter((playlist: Playlist) => playlist.details?.user === resp.data.users[0].id )
				});
			});
		}).catch(() => {
			jscookie.remove("jwt");
			jscookie.remove("sat");
			jscookie.remove("srt");
			window.location.href = "../login";
		});
	}

	render(){
		return <>
			<h1>{this.state.user?.email}</h1>
			<h3 className={this.state.user?.refreshToken ? "spotifyConnected" : ""}>{
				this.state.user?.refreshToken ? "Spotify Connected" : <a href="../auth/spotify">Connect Spotify</a>
			}</h3>
			<ul>{
				this.state.playlists.map(playlist => <li key={playlist.details?.name}><a href={`../app?playlist=${encodeURIComponent(playlist.id as string)}`}>{playlist.details?.name}</a></li>)
			}</ul>
			<a href="../builder">Build a playlist</a>
		</>
	}
}
