const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const {
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLNonNull,
	GraphQLList,
	GraphQLInt,
	GraphQLFloat,
	GraphQLString,
	GraphQLID,
	GraphQLInputObjectType,
} = require("graphql");

const path = require("path");
require("dotenv").config({ path: __dirname + "/.env" });

const Event = require("./models/events");

const app = express();

app.use(express.json());

const EventType = new GraphQLObjectType({
	name: "Event",
	description: "This represents an event",
	fields: () => ({
		_id: { type: GraphQLNonNull(GraphQLID) },
		title: { type: GraphQLNonNull(GraphQLString) },
		description: { type: GraphQLNonNull(GraphQLString) },
		price: { type: GraphQLNonNull(GraphQLFloat) },
		date: { type: GraphQLNonNull(GraphQLString) },
	}),
});

const EventInputType = new GraphQLInputObjectType({
	name: "EventInput",
	description: "This represents an event input",
	fields: () => ({
		title: { type: GraphQLNonNull(GraphQLString) },
		description: { type: GraphQLNonNull(GraphQLString) },
		price: { type: GraphQLNonNull(GraphQLFloat) },
		date: { type: GraphQLNonNull(GraphQLString) },
	}),
});

const RootQueryType = new GraphQLObjectType({
	name: "Query",
	description: "Root query",
	fields: () => ({
		/*event: {
			type: EventType,
			description: "A single event",
			args: {
				title: { type: GraphQLString },
			},
			resolve: (parent, args) => {
				return Event.find({ title: args.title })
					.then(event => {
						return event => {
							return { ...event._doc };
						};
					})
					.catch(err => {
						console.log(err);
						throw err;
					});
			},
		},*/
		events: {
			type: GraphQLList(EventType),
			description: "List of all events",
			resolve: () => {
				return Event.find()
					.then(events => {
						return events.map(event => {
							return { ...event._doc };
						});
					})
					.catch(err => {
						console.log(err);
						throw err;
					});
			},
		},
	}),
});

const RootMutationType = new GraphQLObjectType({
	name: "Mutation",
	description: "Root mutation",
	fields: () => ({
		createEvent: {
			type: EventType,
			description: "Create an event",
			args: {
				eventInput: { type: EventInputType },
			},
			resolve: (parent, args) => {
				const event = new Event({
					title: args.eventInput.title,
					description: args.eventInput.description,
					price: +args.eventInput.price,
					date: new Date(args.eventInput.date),
				});
				return event
					.save()
					.then(result => {
						return { ...result._doc };
					})
					.catch(err => {
						console.log(err);
						throw err;
					});
			},
		},
	}),
});

const schema = new GraphQLSchema({
	query: RootQueryType,
	mutation: RootMutationType,
});

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
		app.listen(3000, () => console.log("Server running"));
	})
	.catch(err => {
		console.log(err);
	});
