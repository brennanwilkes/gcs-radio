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

	componentDidMount(){
		axios.get("/auth", {withCredentials: true}).then(() => {
			window.location.pathname = "../dashboard";
		}).catch(() => {});
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
		}).then(() => {
			window.location.pathname = "../dashboard";
		}).catch(err => {
			alert(err.response.data);
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
				{
					this.props.signup ? <FloatingLabel id="password2" label="Confirm password" type="password" /> : <></>
				}
				<a href="../auth/google" className="btn btn-info">
					Login with Google
				</a>
				<a href="../auth/spotify" className="btn btn-success">
					Login with Spotify
				</a>

				<button
					onClick={this.login}
					className={`btn btn-${this.state.processing ? "warning" : "primary"}`}>{
					this.state.processing
					? `Processing`
					: `${this.props.signup ? "Sign Up" : "Login"}`
				}</button>
			</div>
		</>
	}
}
