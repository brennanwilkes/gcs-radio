// Brennan Wilkes

// Import and setup
import { mongoose } from "../connection";
import { User as UserType } from "../../types/user";
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	username: {
		type: String
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String
	},
	type: {
		type: String,
		required: true
	},
	refreshToken: {
		type: String
	},
	createdAt: {
		type: Date,
		default: Date.now()
	}
});

export interface UserDoc extends mongoose.Document {
	username: string,
	email: string,
	type: string,
	password?: string,
	createdAt: Date,
	refreshToken?: string
}

const User = mongoose.model<UserDoc>("user", UserSchema);
export default User;

export function userDocFromUser (user: UserType, password?: string): UserDoc {
	return new User({
		email: user.email,
		type: user.type,
		refreshToken: user.refreshToken,
		password: password
	});
}

export { UserSchema };
