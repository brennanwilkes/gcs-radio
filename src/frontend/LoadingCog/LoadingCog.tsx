// Brennan Wilkes

// Imports
import * as React from "react";
import { ImCog } from "react-icons/im";
import "./LoadingCog.css";

interface IProps {
	size: number
	style?: React.CSSProperties
}
interface IState {}

/**
 * A small cog loading icon
 * @class
 * @extends React.Component
 */
export default class LoadingCog extends React.Component<IProps, IState> {
	render () {
		return <>
			<div style={this.props.style ?? {}} className="loadingCog">
				<ImCog size={this.props.size} />
			</div>
		</>;
	}
}
