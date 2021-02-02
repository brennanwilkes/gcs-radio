// Brennan Wilkes

// Imports
import "dotenv/config";

import mongoose from "mongoose";
const mongoDB = `${process.env.DB_CONNECTION}?retryWrites=true&w=majority`;

// Set timeout limit
//mongoose.set("maxTimeMS", 25000);

const connection = mongoose.connect(mongoDB, {
	useUnifiedTopology: true,
	useNewUrlParser: true
});

// Export
export {connection, mongoose};
