// Brennan Wilkes

// Imports
import "dotenv/config";

import mongoose from "mongoose";
import { CONFIG } from "../backend/util/util";
const mongoDB = `${CONFIG.databaseConnectionString}?retryWrites=true&w=majority`;

const connection = mongoose.connect(mongoDB, {
	useUnifiedTopology: true,
	useNewUrlParser: true
});

// Export
export { connection, mongoose };
