import React from "react";
import { Bar } from "react-chartjs-2";

export default function BookingsChart(props) {
	const BOOKINGS_BUCKETS = {
		Cheap: {
			min: 0,
			max: 50,
		},
		Normal: {
			min: 50,
			max: 100,
		},
		Expensive: {
			min: 100,
			max: 1000000,
		},
	};

	const chartData = { labels: [], datasets: [] };
	let values = [];
	for (const bucket in BOOKINGS_BUCKETS) {
		const filteredBookingsCount = props.bookings.reduce((prev, curr) => {
			if (
				curr.event.price > BOOKINGS_BUCKETS[bucket].min &&
				curr.event.price < BOOKINGS_BUCKETS[bucket].max
			) {
				return prev + 1;
			}
			return prev;
		}, 0);
		values.push(filteredBookingsCount);
		chartData.labels.push(bucket);
		chartData.datasets.push({
			label: bucket,
			backgroundColor: "rgba(255,99,132,0.2)",
			borderColor: "rgba(255,99,132,1)",
			borderWidth: 1,
			hoverBackgroundColor: "rgba(255,99,132,0.4)",
			hoverBorderColor: "rgba(255,99,132,1)",
			data: values,
		});
		values = [...values];
		values[values.length - 1] = 0;
	}

	return (
		<div style={{ textAlign: "center" }}>
			<Bar data={chartData} />
		</div>
	);
}
