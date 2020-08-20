import React, { useState } from "react";
import "./Events.css";
import Modal from "../components/modal/Modal.js";
import Backdrop from "../components/backdrop/Backdrop.js";

export default function Events() {
	const [creating, setCreating] = useState(false);

	function modalCancelHandler() {
		setCreating(false);
	}

	function modalConfirmHandler() {
		setCreating(false);
	}

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
					<p>Modal Content</p>
				</Modal>
			)}
			<div className="events-control">
				<p>Share your own Events!</p>
				<button className="btn" onClick={() => setCreating(true)}>
					Create Event
				</button>
			</div>
		</>
	);
}
