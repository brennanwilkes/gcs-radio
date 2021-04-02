import { query, ValidationChain } from "express-validator";
import { mongoose } from "../../database/connection";
import { Model, Document } from "mongoose";
import axios from "axios";
import { CONFIG } from "../util/util";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const mongoVerifyExistance = (id: string, Collection: Model<Document<any>>): Promise<boolean> => {
	return Collection.exists({ _id: new mongoose.Types.ObjectId(id) });
};
/* eslint-enable @typescript-eslint/no-explicit-any */

export const mongoVerifyBucketExistance = async (id: string, bucketName = "audio"): Promise<boolean> => {
	return new Promise((resolve) => {
		const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
			bucketName: bucketName
		});
		bucket.find({ _id: new mongoose.Types.ObjectId(id) }).toArray().then(res => {
			resolve(res.length > 0);
		}).catch(() => resolve(false));
	});
};

export const verifyUrlExistance = async (url: string): Promise<boolean> => {
	return new Promise((resolve) => {
		axios.get(url).then(res => {
			resolve(res.status === 200);
		}).catch(() => resolve(false));
	});
};

export const mongoIdRegex = /^[a-fA-F0-9]{24}$/;
export const youtubeIdRegex = /^([0-9A-Za-z_-]{10}[048AEIMQUYcgkosw]|DEFAULT)$/;
export const spotifyIdRegex = /^[0-9A-Za-z]{22}$/;
export const spotifyWebRegex = /^https?:\/\/open.spotify.com\/[a-zA-Z]+\/([0-9A-Za-z]{22})\?si=.*$/;
export const spotifyURIRegex = /^spotify:[a-zA-Z]+:([0-9A-Za-z]{22})$/;

export const youtubeIdValidator = (variable: ValidationChain): ValidationChain => variable.exists()
	.trim()
	.matches(youtubeIdRegex)
	.withMessage("Youtube ID is not valid");

export const mongoIdValidator = (variable: ValidationChain): ValidationChain => variable.exists()
	.trim()
	.matches(mongoIdRegex)
	.withMessage("Internal ID is not valid");

export const spotifyIdValidator = (variable: ValidationChain): ValidationChain => variable.exists()
	.trim()
	.matches(spotifyIdRegex)
	.withMessage("Spotify ID is not valid");

export const limitValidator = (limit: number = CONFIG.defaultApiLimit): ValidationChain => query("limit").optional()
	.default(limit)
	.trim()
	.escape()
	.isNumeric()
	.toInt();
