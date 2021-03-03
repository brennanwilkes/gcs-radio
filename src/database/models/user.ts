// Brennan Wilkes

// Import and setup
import { mongoose } from "../connection";
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
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now()
	}
});

export interface UserDoc extends mongoose.Document {
	username: string,
	email: string,
	password: string,
	createdAt: Date,
}

const User = mongoose.model<UserDoc>("user", UserSchema);
export default User;

export { UserSchema };
