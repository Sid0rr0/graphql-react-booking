const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
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

const Event = require("./models/event");
const User = require("./models/user");

const app = express();

const events = eventIds => {
	return Event.find({ _id: { $in: eventIds } })
		.then(events => {
			return events.map(event => {
				return {
					...event._doc,
					creator: user.bind(this, event.creator),
				};
			});
		})
		.catch(err => {
			throw err;
		});
};

const user = userId => {
	return User.findById(userId)
		.then(user => {
			return {
				...user._doc,
				createdEvents: events.bind(this, user._doc.createdEvents),
			};
		})
		.catch(err => {
			throw err;
		});
};

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
		creator: { type: GraphQLNonNull(UserType) },
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

const UserType = new GraphQLObjectType({
	name: "User",
	description: "This represents a user",
	fields: () => ({
		_id: { type: GraphQLNonNull(GraphQLID) },
		email: { type: GraphQLNonNull(GraphQLString) },
		password: { type: GraphQLString },
		createdEvents: { type: GraphQLList(GraphQLNonNull(EventType)) },
	}),
});

const UserInputType = new GraphQLInputObjectType({
	name: "UserInput",
	description: "This represents a user input",
	fields: () => ({
		email: { type: GraphQLNonNull(GraphQLString) },
		password: { type: GraphQLNonNull(GraphQLString) },
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
							return {
								...event._doc,
								creator: user.bind(this, event._doc.creator),
							};
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
					creator: "5f3846f73d6b5941b46190a8",
				});
				let createdEvent;
				return event
					.save()
					.then(result => {
						createdEvent = {
							...result._doc,
							creator: user.bind(this, result._doc.creator),
						};
						return User.findById("5f3846f73d6b5941b46190a8");
					})
					.then(user => {
						if (!user) throw new Error("User not found.");

						user.createdEvents.push(event);
						user.save();
					})
					.then(result => {
						return createdEvent;
					})
					.catch(err => {
						console.log(err);
						throw err;
					});
			},
		},
		createUser: {
			type: UserType,
			description: "Create a user",
			args: {
				userInput: { type: UserInputType },
			},
			resolve: (parent, args) => {
				return User.findOne({ email: args.userInput.email })
					.then(user => {
						if (user) throw new Error("Email already used.");

						return bcrypt.hash(args.userInput.password, 12);
					})
					.then(hashedPass => {
						const user = new User({
							email: args.userInput.email,
							password: hashedPass,
						});

						return user
							.save()
							.then(result => {
								return { ...result._doc, password: null };
							})
							.catch(err => {
								console.log(err);
								throw err;
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
