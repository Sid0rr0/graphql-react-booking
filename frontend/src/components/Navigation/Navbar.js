import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import AuthContext from "../../context/auth-context";

export default function Navbar(props) {
	const authContext = useContext(AuthContext);

	return (
		<header className="main-navigation">
			<div className="main-navigation__logo">
				<h1>EasyEvents</h1>
			</div>
			<nav className="main-navigation__items">
				<ul>
					{!authContext.token && (
						<li>
							<NavLink to="/auth">Auth</NavLink>
						</li>
					)}
					<li>
						<NavLink to="/events">Events</NavLink>
					</li>
					{authContext.token && (
						<li>
							<NavLink to="/bookings">Bookins</NavLink>
						</li>
					)}
				</ul>
			</nav>
		</header>
	);
}
