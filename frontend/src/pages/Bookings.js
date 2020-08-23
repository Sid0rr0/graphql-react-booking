import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/auth-context";
import Spinner from "../components/spinner/Spinner";

export default function Bookings() {
	const [isLoading, setIsLoading] = useState(false);
	const [bookings, setBookings] = useState([]);
	const authContext = useContext(AuthContext);

	/*function fetchBookings() {
		setIsLoading(true);
		const requestBody = {
			query: `
				query {
					bookings {
						_id
						createdAt
						event {
							_id
							title
							date
						}
					}
				}
			`,
		};

		fetch("http://localhost:8000/graphql", {
			method: "POST",
			body: JSON.stringify(requestBody),
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${authContext.token}`,
			},
		})
			.then(res => {
				if (res.status !== 200 && res.status !== 201)
					throw new Error("Failed");
				return res.json();
			})
			.then(resData => {
				setBookings(resData.data.bookings);
				setIsLoading(false);
			})
			.catch(err => {
				console.log(err);
				setIsLoading(false);
			});
	}*/

	useEffect(() => {
		//fetchBookings();
		setIsLoading(true);
		const requestBody = {
			query: `
				query {
					bookings {
						_id
						createdAt
						event {
							_id
							title
							date
						}
					}
				}
			`,
		};

		fetch("http://localhost:8000/graphql", {
			method: "POST",
			body: JSON.stringify(requestBody),
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${authContext.token}`,
			},
		})
			.then(res => {
				if (res.status !== 200 && res.status !== 201)
					throw new Error("Failed");
				return res.json();
			})
			.then(resData => {
				setBookings(resData.data.bookings);
				setIsLoading(false);
			})
			.catch(err => {
				console.log(err);
				setIsLoading(false);
			});
	}, [authContext.token]);

	return (
		<div>
			{isLoading ? (
				<Spinner />
			) : (
				<ul>
					{bookings.map(booking => (
						<li key={booking._id}>
							{booking.event.title} -{" "}
							{new Date(booking.createdAt).toLocaleDateString()}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
