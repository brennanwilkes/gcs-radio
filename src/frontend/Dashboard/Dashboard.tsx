import * as React from "react";
import axios from "axios";
import {Playlist} from "../../types/playlist";
import {User} from "../../types/user";
import jscookie from "js-cookie";
import Response, {HasResponse, axiosErrorResponseHandler, successResponseHandler} from "../Response/Response";
import NavBar from "../Navbar/Navbar";
import HrWrapper from "../HrWrapper/HrWrapper";
import PlaylistView from "../PlaylistView/PlaylistView";

import "./dashboard.scss";

interface IProps {}
interface IState extends HasResponse{
	playlists: Playlist[],
	user?: User
}

export default class Dashboard extends React.Component<IProps, IState> {

	constructor(props: IProps){
		super(props);
		this.deletePlaylist = this.deletePlaylist.bind(this);

		this.state = {
			playlists: []
		}
	}

	deletePlaylist(playlist: Playlist, i: number){
		axios.delete(`../api/v1/playlists/${playlist.id}`).then(() => {
			this.setState({
				playlists: this.state.playlists.filter((_p:Playlist, ii: number) => i !== ii)
			});
			successResponseHandler(this)(`Deleted ${playlist.details?.name ?? playlist.id}`);
		}).catch(axiosErrorResponseHandler);
	}

	componentDidMount(){
		$("body").css("cursor","wait");

		axios.get("/auth").then(resp => {
			this.setState({
				user: resp.data.users[0]
			});

			axios.get("/api/v1/playlists?noRender=1").then(resp2 => {
				this.setState({
					playlists: resp2.data.playlists.filter((playlist: Playlist) => playlist.details?.user === resp.data.users[0].id )
				});

			}).catch(axiosErrorResponseHandler).finally(() => {
				if(this.state.playlists.length < 1){
					$("body").css("cursor", "inherit");
				}
			});
		}).catch(() => {
			jscookie.remove("jwt");
			jscookie.remove("sat");
			jscookie.remove("srt");
			window.location.href = "../login";
		});
	}

	render(){

		const connected = !!this.state.user?.refreshToken;

		return <>
			<NavBar />
			<div className="Dashboard container-lg mt-md-5">

				<button
					disabled={connected}
					className={`col-12 col-md-5 mr-md-4 mb-2 btn btn-lg btn-${connected ? "gcs-elevated" : "gcs-faded" }`}
					onClick={() => {
						window.location.href = "../auth/spotify";
					}}
				>{
					connected ? "Spotify Connected" : "Connect To Spotify"
				}</button>

				<button
					className="col-12 col-md-5 ml-md-4 mb-2 btn btn-lg btn-gcs-bright"
					onClick={() => {
						window.location.href = "../builder";
					}}
				>
					Create New Playlist
				</button>

				<div className="col-12 col-md-6 ml-md-3 mb-2 mb-lg-4 h6"><div className="w-100">
					<a
						className={`${connected ? "" : "anchorDisabled"}`}
						onClick={() => {
							axios.delete("../auth/spotify").then(() => {
								successResponseHandler(this)(`Spotify Disconnected from ${this.state.user?.email}`);
								jscookie.remove("sat");
								jscookie.remove("srt");
								axios.get("/auth").then(resp => {
									this.setState({
										user: resp.data.users[0]
									});
								});
							}).catch(axiosErrorResponseHandler(this));
					}}>Disconnect</a>
					<h6 className="text-gcs-alpine mx-2 my-0">|</h6>
					<a
						href="../login"
						onClick={() => {
							jscookie.remove("jwt");
							jscookie.remove("sat");
							jscookie.remove("srt");
							window.location.href = "../login";
					}}>Signout</a>
				</div></div>


				<HrWrapper style={{
					borderBottomColor: "var(--gcs-faded)"
				}} children={
					<h2 className="text-gcs-faded" >Your Playlists</h2>
				} />
				<div>
				{
					this.state.playlists.map((playlist, i) => <PlaylistView
						first={i===0}
						last={i===this.state.playlists.length - 1}
						key={`${playlist.id}-${i}`}
						playlist={playlist}
						keyExtension={i}
						deleteCallback={this.deletePlaylist}
					/>)
				}
				</div>
			</div>
			<Response response={this.state} />
		</>
	}
}
