import * as React from "react";
import axios, { AxiosResponse } from "axios";
import {Song} from '../types/song';

interface IProps {}
interface IState {
}

export default class Builder extends React.Component<IProps, IState> {

	constructor(props: IProps) {
		super(props);
	}




	render(){
		return <>
			<div className="Builder">
			</div>
		</>
	}
}
