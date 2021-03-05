import * as React from "react";
import "./login.css";
import axios from "axios";
import FloatingLabel from "react-bootstrap-floating-label";


interface IProps {
	signup: boolean
}
interface IState {
	processing: boolean
}

export default class Landing extends React.Component<IProps, IState> {

	static defaultProps = {
		signup: false
	};

	constructor(props: IProps) {
		super(props);
		this.login = this.login.bind(this);

		this.state = {
			processing: false
		}
	}

	login(_event: React.FormEvent){
		this.setState({
			processing: true
		});

		const email = String($("#email > input").val());
		const password = String($("#password1 > input").val());
		//const password2 = String($("#password2 > input").val());

		axios.post(`../auth${!this.props.signup ? "/login" : ""}`,{
			email,
			password
		}).then(res => {
			console.dir(res.data);
		}).catch(err => {
			console.error(err.response.data);
		}).finally(() => {
			this.setState({
				processing: false
			})
		})
	}

	render(){
		return <>
			<div className="Login">
				<h1>GCS Radio</h1>
				<FloatingLabel id="email" label="Email" />
				<FloatingLabel id="password1" label="Password" type="password" />
				<FloatingLabel id="password2" label="Confirm password" type="password" />
				<a href="../auth/google" className="btn btn-info">
					Login with Google
				</a>

				<button
					onClick={this.login}
					className={`btn btn-${this.state.processing ? "warning" : "success"}`}>{
					this.state.processing
					? `Processing`
					: `${this.props.signup ? "Sign Up" : "Login"}`
				}</button>
			</div>
		</>
	}
}
