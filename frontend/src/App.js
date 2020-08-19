import React from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import "./App.css";
import Auth from "./pages/Auth";
import Events from "./pages/Events";
import Bookings from "./pages/Bookings";
import Navbar from "./components/Navigation/Navbar";

function App() {
	return (
		<BrowserRouter>
			<Navbar />
			<main className="main-content">
				<Switch>
					<Redirect from="/" to="/auth" exact />
					<Route path="/auth" component={Auth} />
					<Route path="/events" component={Events} />
					<Route path="/bookings" component={Bookings} />
				</Switch>
			</main>
		</BrowserRouter>
	);
}

export default App;
