import { query } from "express-validator";
import { validationErrorHandler, verifyUrlExistance } from "./validatorUtil";

export default [
	query("id")
		.exists()
		.trim()
		.matches(/^[0-9A-Za-z_-]{10}[048AEIMQUYcgkosw]$/)
		.withMessage("source ID is not valid"),
	query("id").custom(async id => {
		const exists = await verifyUrlExistance(`https://www.youtube.com/oembed?url=http://www.youtube.com/watch?v=${id}&format=json`);
		if (!exists) {
			return Promise.reject(new Error("source ID doesn't exist"));
		}
	}).withMessage("source ID doesn't exist"),
	validationErrorHandler
];
