import * as React from "react";
import "./reactBootstrapCheckbox.css";
import {FaCheckCircle, FaTimesCircle} from "react-icons/fa";

interface IProps {
	size?: number
	colour?: string
	label: string
	onChange?: (checked: boolean) => void
	default?: boolean
}
interface IState {
	checked: boolean
}

export default class PlaylistDetailAdder extends React.Component<IProps, IState> {

	constructor(props: IProps){
		super(props);

		this.state = {
			checked: this.props.default ?? false
		}
	}

	render(){
		return <>
			<label className={`mb-0 reactBootstrapCheckboxWrapper btn font-weight-bold ${this.props.colour ? `btn-${this.props.colour}` : ""}`}>{
					this.props.label
				}
				<input
					type="checkbox"
					checked={this.state.checked}
					className="reactBootstrapCheckbox"
					onChange={() => {
						const checked = !this.state.checked
						this.setState({
							checked
						});
						if(this.props.onChange){
							this.props.onChange(checked);
						}
					}}/>
				<span className="badge">{
					this.state.checked
						? <FaCheckCircle size={this.props.size ?? 20} />
						: <FaTimesCircle size={this.props.size ?? 20} />
					}</span>
			</label>
		</>;
	}
}
