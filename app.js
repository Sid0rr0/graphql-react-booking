const express = require("express");
const mongoose = require("mongoose");
const { graphqlHTTP } = require("express-graphql");
const { GraphQLSchema, GraphQLObjectType } = require("graphql");
const path = require("path");
require("dotenv").config({ path: __dirname + "/.env" });
const { createUser, login } = require("./graphql/resolvers/user");
const { events, createEvent } = require("./graphql/resolvers/events");
const {
	bookings,
	bookEvent,
	cancelBooking,
} = require("./graphql/resolvers/booking");
const isAuth = require("./middleware/is-auth");

const app = express();
app.use(express.json());

const RootQueryType = new GraphQLObjectType({
	name: "Query",
	description: "Root query",
	fields: () => ({
		events: { ...events },
		bookings: { ...bookings },
		login: { ...login },
	}),
});

const RootMutationType = new GraphQLObjectType({
	name: "Mutation",
	description: "Root mutation",
	fields: () => ({
		createUser: { ...createUser },
		createEvent: { ...createEvent },
		bookEvent: { ...bookEvent },
		cancelBooking: { ...cancelBooking },
	}),
});

const schema = new GraphQLSchema({
	query: RootQueryType,
	mutation: RootMutationType,
});

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Content-Type, Authorization"
	);
	if (req.method === "OPTIONS") return res.sendStatus(200);
	next();
});

app.use(isAuth);

app.use(
	"/graphql",
	graphqlHTTP({
		schema: schema,
		graphiql: true,
	})
);

mongoose
	.connect(
		`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-7gj1q.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
		{ useNewUrlParser: true, useUnifiedTopology: true }
	)
	.then(() => {
		app.listen(8000, () => console.log("Server running"));
	})
	.catch(err => {
		console.log(err);
	});
