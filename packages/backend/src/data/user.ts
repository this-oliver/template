import Mongoose from "mongoose";
import { hashPassword } from "../utils/crypto";
import type { User } from "../types/logic";

const GENERIC_PROJECTION = "-password";

const UserModel = Mongoose.model("user", new Mongoose.Schema<User>(
	{
		username: { type: String, required: true, unique: true },
		password: { type: String, required: true }
	},
	{ timestamps: true })
	.pre("save", function(next) {
		if(this.isModified("password")) {
			const hash: string = hashPassword(this.password);
			this.password = hash;
		}
		next();
	})
);

async function createUser(user: Omit<User, keyof Mongoose.Document>, config?: { secrets: boolean }): Promise<User> {
	if(await getUserByUsername(user.username)) {
		throw new Error(`User with username ${user.username} already exists`);
	}
  
	const newUser = await UserModel.create(new UserModel(user));

	if(config?.secrets !== true) {
		newUser.password = "";
	}

	return newUser;
}

async function getUserById(id: string, config?: { secrets: boolean}): Promise<User | null> {
	return config?.secrets 
		? await UserModel.findById(id).exec()
		: await UserModel.findById(id).select(GENERIC_PROJECTION).exec();
}

async function getUserByUsername(username: string, config?: { secrets: boolean}): Promise<User | null> {
	return config?.secrets
		? await UserModel.findOne({ username: { $eq: username } }).exec()
		: await UserModel.findOne({ username: { $eq: username } }).select(GENERIC_PROJECTION).exec();
}

async function indexUsers(config?: { secrets: boolean}): Promise<User[]> {
	return config?.secrets 
		? await UserModel.find().exec()
		: await UserModel.find().select(GENERIC_PROJECTION).exec();
}

async function updateUser(id: string, patch: Partial<User>, config?: { secrets: boolean}): Promise<User | null> {
	const user = await getUserById(id);

	if(!user){
		throw new Error(`User with id ${id} not found`);
	}

	user.username = patch.username || user.username;

	const patchedUser = await user.save();

	if(!config?.secrets) {
		patchedUser.password = "";
	}

	return patchedUser;
}

async function updateUserPassword(id: string, password: string, config?: { secrets: boolean}): Promise<User | null> {
	const user = await getUserById(id, { secrets: true });

	if(!user){
		throw new Error(`User with id ${id} not found`);
	}

	user.password = password || user.password;

	const patchedUser = await user.save();

	if(!config?.secrets) {
		patchedUser.password = "";
	}

	return patchedUser;
}

async function deleteUser (id: string): Promise<User | null> {
	const user = await getUserById(id);

	if(!user){
		throw new Error(`User with id ${id} not found`);
	}

	return await UserModel.findByIdAndDelete(user.id);
}

export { 
	UserModel,
	createUser,
	getUserById,
	getUserByUsername,
	indexUsers,
	updateUser,
	updateUserPassword,
	deleteUser
};
