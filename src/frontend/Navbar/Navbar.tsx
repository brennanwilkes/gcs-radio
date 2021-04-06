import * as React from "react";
import axios from "axios";
import jscookie from "js-cookie";

import "./navbar.scss";
import {UserWithId} from "../../types/user";

import {useTranslation} from "react-i18next";

//const Home = () => <>{useTranslation("common").t("nav.home")}</>
const Build = () => <>{useTranslation("common").t("nav.build")}</>
const Browse = () => <>{useTranslation("common").t("nav.browse")}</>
const Login = () => <>{useTranslation("common").t("nav.login")}</>
const Profile = () => <>{useTranslation("common").t("nav.profile")}</>
const Generate = () => <>{useTranslation("common").t("nav.generate")}</>


interface IProps {}
interface IState {
	user?: UserWithId,
	loggedIn: boolean
}

interface NavItemData{
	text: JSX.Element,
	href: string,
	className?: string
}

class NavItem extends React.Component<{item:NavItemData}, IState>{
	render(){
		return <>
			<a className="text-gcs-faded mx-2 h3 my-0 p-2" href={this.props.item.href}>
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
			{text: <Generate />, href: "../generate"},
			{text: <Build />, href: "../build"},
			{text: <Browse />, href: "../browse"},
			{text: (this.state.user ? <Profile /> : <Login />), href: `../${this.state.loggedIn ? "dashboard" : "login"}`},
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
