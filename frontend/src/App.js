import React, { useState } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import "./App.css";
import Auth from "./pages/Auth";
import Events from "./pages/Events";
import Bookings from "./pages/Bookings";
import Navbar from "./components/Navigation/Navbar";
import AuthContext from "./context/auth-context";

function App() {
	const [token, setToken] = useState(null);
	const [userId, setUserId] = useState(null);
	if(!token) console.log("aaaaa");

	function login(newToken, newUserId, newTokenExpiration) {
		setToken(newToken);
		setUserId(newUserId);
	}

	function logout() {
		setToken(null);
		setUserId(null);
	}

	return (
		<BrowserRouter>
			<AuthContext.Provider
				value={{
					token: token,
					userId: userId,
					login: login,
					logout: logout,
				}}
			>
				<Navbar />
				<main className="main-content">
					<Switch>
						{!token && <Redirect from="/" to="/auth" exact />}
						{token && <Redirect from="/" to="/events" exact />}
						{token && <Redirect from="/auth" to="/events" exact />}
						{!token && <Route path="/auth" component={Auth} />}
						<Route path="/events" component={Events} />
						{token && <Route path="/bookings" component={Bookings} />}
					</Switch>
				</main>
			</AuthContext.Provider>
		</BrowserRouter>
	);
}

export default App;
