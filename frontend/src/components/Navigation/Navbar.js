import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar(props) {
	return (
		<header className="main-navigation">
			<div className="main-navigation__logo">
				<h1>EasyEvents</h1>
			</div>
			<nav className="main-navigation__items">
				<ul>
					<li>
						<NavLink to="/auth">Auth</NavLink>
					</li>
					<li>
						<NavLink to="/events">Events</NavLink>
					</li>
					<li>
						<NavLink to="/bookings">Bookins</NavLink>
					</li>
				</ul>
			</nav>
		</header>
	);
}
