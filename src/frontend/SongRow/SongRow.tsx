import * as React from "react";
import {Song} from '../../types/song';

import "./songRow.scss";

interface IProps {
	song: Song,
	keyExtension?: string,
	onClick?: (song: Song) => void,
	isHoverable?: boolean
}
interface IState {}

export default class Builder extends React.Component<IProps, IState> {

	render(){
		const key = getSongKey(this.props.song) + this.props.keyExtension ?? "";
		return <>
			<li className={`songRow${this.props.isHoverable ? " songRowHoverable" : ""}`} key={key} onClick={() => {
				if(this.props.onClick){
					this.props.onClick(this.props.song);
				}
			}}>
				<img src={this.props.song.thumbnailUrl}/>
				<div>
					<h3>{this.props.song.title}</h3>
					<h4>{this.props.song.artist}</h4>
				</div>
			</li>
		</>
	}
}

export function getSongKey(song: Song, shift: number | string = 0){
	return `${song.id ?? `${song.spotifyId}:${song.youtubeId}`}-${shift}`;
}
