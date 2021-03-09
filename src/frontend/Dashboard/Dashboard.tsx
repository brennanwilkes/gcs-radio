import * as React from "react";
import axios from "axios";
import {Playlist} from "../../types/playlist";
import {User} from "../../types/user";

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
			console.dir(resp.data);

			axios.get("/api/v1/playlists").then(resp2 => {
				this.setState({
					playlists: resp2.data.playlists.filter((playlist: Playlist) => playlist.details?.user === resp.data.users[0].id )
				});
				console.dir(resp2.data);
			});
		});


	}

	render(){
		return <>
			<h1>{this.state.user?.email}</h1>
			<ul>{
				this.state.playlists.map(playlist => <li key={playlist.details?.name}><a href={`../app?playlist=${encodeURIComponent(playlist.id as string)}`}>{playlist.details?.name}</a></li>)
			}</ul>
			<a href="../builder">Build a playlist</a>
		</>
	}
}
