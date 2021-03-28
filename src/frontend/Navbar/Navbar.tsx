import * as React from "react";
import axios from "axios";
import jscookie from "js-cookie";

import "./navbar.scss";
import {UserWithId} from "../../types/user";


interface IProps {}
interface IState {
	user?: UserWithId,
	loggedIn: boolean
}

interface NavItemData{
	text: string,
	href: string,
	className?: string
}

class NavItem extends React.Component<{item:NavItemData}, IState>{
	render(){
		return <>
			<a className="text-gcs-faded col-3 col-md-2 h3 my-0 p-2" href={this.props.item.href}>
				<h3 className={`${this.props.item.className ?? ""} rh3 m-0`}>{this.props.item.text}</h3>
			</a>
		</>;
	}
}

export default class Navbar extends React.Component<IProps, IState> {

	constructor(props: IProps) {
		super(props);
		this.state = {
			loggedIn: !!jscookie.get("jwt")
		};
	}

	componentDidMount(){
		axios.get("/auth").then(resp => {
			this.setState({
				user: resp.data.users[0],
				loggedIn: true
			});
		}).catch(() => {
			this.setState({
				loggedIn: false
			});
		});
	}

	render(){

		const navigation: NavItemData[] = [
			{text: "Home", href: ".."},
			{text: "Build", href: "../builder"},
			{text: "Browse", href: "../browser"},
			{text: (this.state.user ? "Profile" : "Login"), href: `../${this.state.loggedIn ? "dashboard" : "login"}`},
		]

		return <>
			<header>
				<h1 className="text-gcs-loud mb-0 mt-n4 rh1">GCS Radio</h1>
				<nav className="container-lg row pt-md-5 py-3 mx-0">{
					navigation.map(link => <NavItem key={`${link.text}-${link.href}`} item={link} />)
				}</nav>
			</header>
		</>
	}
}