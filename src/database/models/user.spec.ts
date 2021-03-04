import { mongoose } from "../connection";
import User from "./user";
const mongoIdRegex = /^[a-fA-F0-9]{24}$/;

beforeAll(done => {
	mongoose.connection.once("open", done);
});

test("User model is created correctly", () => {
	expect(String(new User({email:"TEST",password:"TEST"})._id)).toMatch(mongoIdRegex);
});

afterAll(async () => {
	await mongoose.connection.close();
});
