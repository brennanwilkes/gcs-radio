import * as React from "react";
import axios from "axios";
import {Song} from '../../types/song';

import FloatingLabel from "react-bootstrap-floating-label";
import HrWrapper from "../HrWrapper/HrWrapper";
import "./playlistDetailAdder.css";

interface IProps {
	detailCallback: ((details: IState) => void),
	initialName?: string,
	initialDescription?: string,
	initialPrivate?: boolean
}
interface IState {
	name?: string
	description?: string,
	private?: boolean
}

export {IState as Details};
export default class PlaylistDetailAdder extends React.Component<IProps, IState> {

	componentDidUpdate(_prevProps: IProps, prevState: IState){
		if(prevState !== this.state){
			this.props.detailCallback(this.state);
		}
	}

	handleSearch(event: React.FormEvent, queryParam: string): Promise<Song[]>{
		return new Promise<Song[]>((resolve, reject) => {
			const query = encodeURIComponent((event.target as HTMLTextAreaElement).value);
			if(query){
				axios.get(`/api/v1/search?${queryParam}=${query}`).then(res => {
					resolve(res.data.songs);
				}).catch(reject);
			}
			else {
				resolve([])
			}
		});
	}


	render(){


		return <>
			<div className="DetailAdder">
				<HrWrapper style={{
					borderBottomColor: "#CCC"
				}} children={
					<h2>Details</h2>
				} />
				<FloatingLabel
					initialValue={this.props.initialName}
					label="Name"
					onChange={(event) => this.setState({name: (event.target as HTMLTextAreaElement).value})}
					onChangeDelay={150} />
				<FloatingLabel
					initialValue={this.props.initialDescription}
					label="Description"
					onChange={(event) => this.setState({description: (event.target as HTMLTextAreaElement).value})}
					onChangeDelay={150} />
			</div>
		</>
	}
}
