const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const {
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLNonNull,
	GraphQLList,
	GraphQLFloat,
	GraphQLString,
	GraphQLID,
	GraphQLInputObjectType,
} = require("graphql");

const path = require("path");
require("dotenv").config({ path: __dirname + "/.env" });

const EventModel = require("./models/event");
const UserModel = require("./models/user");

const app = express();

const getEvents = async eventIds => {
	try {
		const events = await EventModel.find({ _id: { $in: eventIds } });
		return events.map(event => {
			return {
				...event._doc,
				date: new Date(event._doc.date).toISOString(),
				creator: getUser.bind(this, event.creator),
			};
		});
	} catch (err) {
		console.log(err);
		throw err;
	}
};

const getUser = async userId => {
	try {
		const oneUser = await UserModel.findById(userId);
		return {
			...oneUser._doc,
			createdEvents: getEvents.bind(this, oneUser._doc.createdEvents),
		};
	} catch (err) {
		console.log(err);
		throw err;
	}
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
			resolve: async () => {
				try {
					const events = await EventModel.find();
					return events.map(event => {
						return {
							...event._doc,
							date: new Date(event._doc.date).toISOString(),
							creator: getUser.bind(this, event._doc.creator),
						};
					});
				} catch (err) {
					console.log(err);
					throw err;
				}
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
			resolve: async (parent, args) => {
				try {
					const newEvent = new EventModel({
						title: args.eventInput.title,
						description: args.eventInput.description,
						price: +args.eventInput.price,
						date: new Date(args.eventInput.date),
						creator: "5f3a94a20168e645242fc345",
					});

					const creator = await UserModel.findById(
						"5f3a94a20168e645242fc345"
					);
					if (!creator) throw new Error("User not found.");

					const result = await newEvent.save();
					creator.createdEvents.push(newEvent);
					await creator.save();

					const savedEvent = {
						...result._doc,
						date: new Date(result._doc.date).toISOString(),
						creator: getUser.bind(this, result._doc.creator),
					};

					return savedEvent;
				} catch (err) {
					console.log(err);
					throw err;
				}
			},
		},
		createUser: {
			type: UserType,
			description: "Create a user",
			args: {
				userInput: { type: UserInputType },
			},
			resolve: async (parent, args) => {
				try {
					const existingUser = await UserModel.findOne({
						email: args.userInput.email,
					});
					if (existingUser) throw new Error("Email already used.");

					const hashedPass = await bcrypt.hash(
						args.userInput.password,
						12
					);

					const newUser = new UserModel({
						email: args.userInput.email,
						password: hashedPass,
					});

					const result = await newUser.save();
					return { ...result._doc, password: null };
				} catch (err) {
					console.log(err);
					throw err;
				}
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
