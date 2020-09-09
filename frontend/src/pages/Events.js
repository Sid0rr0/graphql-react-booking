import React, { useState, useRef, useContext, useEffect } from "react";
import "./Events.css";
import Modal from "../components/modal/Modal.js";
import Backdrop from "../components/backdrop/Backdrop.js";
import AuthContext from "../context/auth-context";
import EventList from "../components/events/EventList";
import Spinner from "../components/spinner/Spinner";

export default function Events() {
	const [creating, setCreating] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [selectedEvent, setSelectedEvent] = useState();
	const [events, setEvents] = useState([]);
	const titleRef = useRef();
	const priceRef = useRef();
	const dateRef = useRef();
	const descriptionRef = useRef();
	const authContext = useContext(AuthContext);

	/*function fetchEvents() {
		setIsLoading(true);
		const requestBody = {
			query: `
				query {
					events {
						_id
						title
						date
						price
						description
						creator {
							_id
							email
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
			},
		})
			.then(res => {
				if (res.status !== 200 && res.status !== 201)
					throw new Error("Failed");
				return res.json();
			})
			.then(resData => {
				setEvents(resData.data.events);
				setIsLoading(false);
			})
			.catch(err => {
				console.log(err);
				setIsLoading(false);
			});
	}*/

	useEffect(() => {
		//fetchEvents();
		setIsLoading(true);
		const requestBody = {
			query: `
				query {
					events {
						_id
						title
						date
						price
						description
						creator {
							_id
							email
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
			},
		})
			.then(res => {
				if (res.status !== 200 && res.status !== 201)
					throw new Error("Failed");
				return res.json();
			})
			.then(resData => {
				setEvents(resData.data.events);
				setIsLoading(false);
			})
			.catch(err => {
				console.log(err);
				setIsLoading(false);
			});
	}, []);

	function modalConfirmHandler() {
		setCreating(false);
		const title = titleRef.current.value;
		const price = +priceRef.current.value;
		const date = dateRef.current.value;
		const description = descriptionRef.current.value;

		if (
			title.trim().length === 0 ||
			price <= 0 ||
			date.trim().length === 0 ||
			description.trim().length === 0
		)
			return;

		const requestBody = {
			query: `
				mutation CreateEvent($title: String!, $price: Float!, $date: String!, $desc: String!) {
					createEvent(eventInput: {title: $title, price: $price, date: $date, description: $desc}) {
						_id
						title
						date
						price
						description
						creator {
							_id
							email
						}
					}
				}
			`,
			variables: {
				title: title,
				price: price,
				date: date,
				desc: description,
			},
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
				const newEvent = resData.data.createEvent;
				setEvents(prevState => [...prevState, newEvent]);
			})
			.catch(err => {
				console.log(err);
			});
	}

	function showDetailHandler(eventId) {
		setSelectedEvent(events.find(e => e._id === eventId));
	}

	function bookEventHandler() {
		if (!authContext.token) {
			setSelectedEvent(null);
			return;
		}
		const requestBody = {
			query: `
				mutation BookEvent($id: ID!) {
					bookEvent(eventId: $id) {
						_id
						createdAt
						updatedAt
					}
				}
			`,
			variables: {
				id: selectedEvent._id,
			},
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
				console.log(resData);
				setSelectedEvent(null);
			})
			.catch(err => {
				console.log(err);
			});
	}

	return (
		<>
			{(creating || selectedEvent) && <Backdrop />}
			{creating && (
				<Modal
					title="Add Event"
					canCancel
					canConfirm
					onCancel={() => setCreating(false)}
					onConfirm={modalConfirmHandler}
					confirmText="Confirm"
				>
					<form>
						<div className="form-control">
							<label htmlFor="title">Title</label>
							<input type="text" id="title" ref={titleRef} />
						</div>
						<div className="form-control">
							<label htmlFor="price">Price</label>
							<input type="number" id="price" ref={priceRef} />
						</div>
						<div className="form-control">
							<label htmlFor="Date">Date</label>
							<input
								type="datetime-local"
								id="Date"
								ref={dateRef}
							/>
						</div>
						<div className="form-control">
							<label htmlFor="description">Description</label>
							<textarea
								id="description"
								rows="4"
								ref={descriptionRef}
							></textarea>
						</div>
					</form>
				</Modal>
			)}
			{selectedEvent && (
				<Modal
					title={selectedEvent.title}
					canCancel
					canConfirm
					onCancel={() => setSelectedEvent(null)}
					onConfirm={bookEventHandler}
					confirmText={authContext.token ? "Book" : "Confirm"}
				>
					<h1>{selectedEvent.title}</h1>
					<h2>
						Price: {selectedEvent.price} Diamonds |{" "}
						{new Date(selectedEvent.date).toLocaleDateString()}
					</h2>
					<p>{selectedEvent.description}</p>
				</Modal>
			)}
			{authContext.token && (
				<div className="events-control">
					<p>Share your own Events!</p>
					<button className="btn" onClick={() => setCreating(true)}>
						Create Event
					</button>
				</div>
			)}
			{isLoading ? (
				<Spinner />
			) : (
				<EventList
					events={events}
					authUserId={authContext.userId}
					onViewDetail={showDetailHandler}
				/>
			)}
		</>
	);
}
