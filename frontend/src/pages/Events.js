import React, { useState, useRef, useContext, useEffect } from "react";
import "./Events.css";
import Modal from "../components/modal/Modal.js";
import Backdrop from "../components/backdrop/Backdrop.js";
import AuthContext from "../context/auth-context";

export default function Events() {
	const [creating, setCreating] = useState(false);
	const [events, setEvents] = useState([]);
	const titleRef = useRef();
	const priceRef = useRef();
	const dateRef = useRef();
	const descriptionRef = useRef();
	const authContext = useContext(AuthContext);

	function fetchEvents() {
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
			})
			.catch(err => {
				console.log(err);
			});
	}

	useEffect(() => {
		fetchEvents();
	}, []);

	function modalCancelHandler() {
		setCreating(false);
	}

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

		//const event = { title, price, date, description };

		const requestBody = {
			query: `
				mutation {
					createEvent(eventInput: {title: "${title}", price: ${price}, date: "${date}", description: "${description}"}) {
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

	const eventList = events.map(event => {
		return (
			<li key={event._id} className="events__list-item">
				{event.title}
			</li>
		);
	});

	return (
		<>
			{creating && <Backdrop />}
			{creating && (
				<Modal
					title="Add Event"
					canCancel
					canConfirm
					onCancel={modalCancelHandler}
					onConfirm={modalConfirmHandler}
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
			{authContext.token && (
				<div className="events-control">
					<p>Share your own Events!</p>
					<button className="btn" onClick={() => setCreating(true)}>
						Create Event
					</button>
				</div>
			)}
			<ul className="events__list">{eventList}</ul>
		</>
	);
}
