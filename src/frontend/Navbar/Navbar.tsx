import * as React from "react";
import axios from "axios";

import "./navbar.css";
import {UserWithId} from "../../types/user";


interface IProps {}
interface IState {
	user?: UserWithId
}

interface NavItemData{
	text: string,
	href: string,
	className?: string
}

class NavItem extends React.Component<{item:NavItemData}, IState>{
	render(){
		return <>
			<a className="text-dark col-3 h3 m-0" href={this.props.item.href}>
				<h3 className={`${this.props.item.className ?? ""} rh3 m-0`}>{this.props.item.text}</h3>
			</a>
		</>;
	}
}

export default class Navbar extends React.Component<IProps, IState> {

	constructor(props: IProps) {
		super(props);
		this.state = {};
	}

	componentDidMount(){
		axios.get("/auth").then(resp => {
			this.setState({
				user: resp.data.users[0]
			});
		}).catch(console.error);
	}

	render(){

		const navigation: NavItemData[] = [
			{text: "Home", href: `../${this.state.user ? "dashboard" : ""}`},
			{text: "Build", href: "../builder"},
			{text: "Browse", href: "../browser"},
			{text: (this.state.user ? "Dashboard" : "Login"), href: `../${this.state.user ? "dashboard" : "login"}`},
		]

		return <>
			<header>
				<nav className="container-lg row py-3 mx-0 my-5">{
					navigation.map(link => <NavItem key={`${link.text}-${link.href}`} item={link} />)
				}</nav>
			</header>
		</>
	}
}
