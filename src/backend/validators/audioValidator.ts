import { param } from "express-validator";
import { mongoVerifyBucketExistance, mongoIdRegex } from "./validatorUtil";
import validationErrorHandler from "../errorHandlers/validationErrorHandler";
import { CONFIG } from "../util/util";

export default [
	param("id")
		.exists()
		.trim()
		.matches(mongoIdRegex)
		.withMessage("audio ID is not a valid ID"),
	param("id").custom(async id => {
		const exists = await mongoVerifyBucketExistance(id, (CONFIG.defaultAudioId && id === CONFIG.defaultAudioId) ? "defaultAudio" : "audio");
		if (!exists) {
			return Promise.reject(new Error("audio ID doesn't exist"));
		}
	}).withMessage("audio ID doesn't exist"),
	validationErrorHandler
];
