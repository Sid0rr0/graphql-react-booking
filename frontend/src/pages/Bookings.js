import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/auth-context";
import Spinner from "../components/spinner/Spinner";
import BookingList from "../components/bookings/BookingList";

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

	function onDelete(bookingId) {
		const requestBody = {
			query: `
				mutation {
					cancelBooking(bookingId: "${bookingId}") {
						_id
						title
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
				setBookings(prevState => {
					return prevState.filter(
						booking => booking._id !== bookingId
					);
				});
			})
			.catch(err => {
				console.log(err);
			});
	}

	return (
		<div>
			{isLoading ? (
				<Spinner />
			) : (
				<BookingList bookings={bookings} onDelete={onDelete} />
			)}
		</div>
	);
}
