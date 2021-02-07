import { param } from "express-validator";
import { validationErrorHandler, mongoVerifyBucketExistance } from "./validatorUtil";

export default [
	param("id")
		.exists()
		.trim()
		.matches(/^[a-fA-F0-9]{24}$/)
		.withMessage("audio ID is not a valid ID"),
	param("id").custom(async id => {
		const exists = await mongoVerifyBucketExistance(id, "songs");
		if (!exists) {
			return Promise.reject(new Error("audio ID doesn't exist"));
		}
	}).withMessage("audio ID doesn't exist"),
	validationErrorHandler
];
