import React, { useRef, useState, useContext } from "react";
import "./Auth.css";
import AuthContext from "../context/auth-context";

export default function Auth() {
	const emailRef = useRef("");
	const passwordRef = useRef("");
	const [isLogin, setIsLogin] = useState(true);

	const authContext = useContext(AuthContext);

	function submitHandler(e) {
		e.preventDefault();
		const email = emailRef.current.value;
		const password = passwordRef.current.value;

		if (email.trim().length === 0 || password.trim().length === 0) return;

		let requestBody = {
			query: `
				query Login($email: String!, $password: String!) {
					login(email: $email, password: $password) {
						userId
						token
						tokenExpiration
					}
				}
			`,
			variables: {
				email: email,
				password: password,
			},
		};

		if (!isLogin) {
			requestBody = {
				query: `
				mutation Register($email: String!, $password: String!) {
					createUser(userInput: {email: $email, password: $password}) {
						_id
						email
					}
				}
			`,
				variables: {
					email: email,
					password: password,
				},
			};
		}

		fetch("http://localhost:8000/graphql", {
			method: "POST",
			body: JSON.stringify(requestBody),
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then(res => {
				if (res.status !== 200 && res.status !== 201)
					throw new Error("Failed");
				return res.json();
			})
			.then(resData => {
				if (resData.data.login.token) {
					authContext.login(
						resData.data.login.token,
						resData.data.login.userId,
						resData.data.login.tokenExpiration
					);
				}
			})
			.catch(err => {
				console.log(err);
			});
	}

	return (
		<div>
			<h1 className="auth-header">{isLogin ? "Log In" : "Register"}</h1>
			<form className="auth-form" onSubmit={submitHandler}>
				<div className="form-control">
					<label htmlFor="email">Email</label>
					<input type="email" id="email" ref={emailRef} />
				</div>
				<div className="form-control">
					<label htmlFor="password">Password</label>
					<input type="password" id="passwod" ref={passwordRef} />
				</div>
				<div className="form-actions">
					<button type="submit">Submit</button>
					<button
						type="button"
						onClick={() => setIsLogin(prevState => !prevState)}
					>
						{isLogin ? "Signup" : "Login"}
					</button>
				</div>
			</form>
		</div>
	);
}
