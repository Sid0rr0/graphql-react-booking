import React, { useRef, useState } from "react";
import "./Auth.css";

export default function Auth() {
	const emailRef = useRef("");
	const passwordRef = useRef("");
	const [isLogin, setisLogin] = useState(true);

	function submitHandler(e) {
		e.preventDefault();
		const email = emailRef.current.value;
		const password = passwordRef.current.value;

		if (email.trim().length === 0 || password.trim().length === 0) return;

		let requestBody = {
			query: `
				query {
					login(email: "${email}", password: "${password}") {
						userId
						token
						tokenExpiration
					}
				}
			`
		}

		if(!isLogin) {
			requestBody = {
				query: `
				mutation {
					createUser(userInput: {email: "${email}", password: "${password}"}) {
						_id
						email
					}
				}
			`,
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
				console.log(resData);
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
						onClick={() => setisLogin(prevState => !prevState)}
					>
						{isLogin ? "Signup" : "Login"}
					</button>
				</div>
			</form>
		</div>
	);
}
