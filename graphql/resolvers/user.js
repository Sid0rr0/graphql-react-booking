const { UserType, UserInputType, AuthType } = require("../types/types");
const { GraphQLString } = require("graphql");
const UserModel = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
	createUser: {
		type: UserType,
		description: "Create a user",
		args: {
			userInput: { type: UserInputType },
		},
		resolve: async (parent, args) => {
			try {
				const fetchedUser = await UserModel.findOne({
					email: args.userInput.email,
				});
				if (fetchedUser) throw new Error("Email already used.");

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
	login: {
		type: AuthType,
		description: "Login user",
		args: {
			email: { type: GraphQLString },
			password: { type: GraphQLString },
		},
		resolve: async (parent, args) => {
			try {
				const fetchedUser = await UserModel.findOne({
					email: args.email,
				});
				if (!fetchedUser) throw new Error("User does not exist");

				const passwordMatch = await bcrypt.compare(
					args.password,
					fetchedUser.password
				);
				if (!passwordMatch) throw new Error("Password does not match");

				const token = jwt.sign(
					{
						userId: fetchedUser.id,
						email: fetchedUser.email,
					},
					"somebodyoncetoldme",
					{ expiresIn: "1h" }
				);

				return {
					userId: fetchedUser.id,
					token: token,
					tokenExpiration: 1,
				};
			} catch (err) {
				console.log(err);
				throw err;
			}
		},
	},
};
