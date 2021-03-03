import * as React from "react";
import "./landing.css";


interface IProps {}
interface IState {}

export default class Landing extends React.Component<IProps, IState> {

	constructor(props: IProps) {
		super(props);
	}

	render(){
		return <>
			<div className="Landing">
				<h1>GCS Radio</h1>
			</div>
		</>
	}
}
