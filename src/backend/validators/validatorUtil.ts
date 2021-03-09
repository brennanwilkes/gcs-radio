import { Result, ValidationChain, ValidationError, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { ErrorObj, Error } from "../../types/error";
import { mongoose } from "../../database/connection";
import { Model, Document } from "mongoose";
import axios from "axios";

export class ValidationErrorJson extends ErrorObj implements Error {
	constructor (errors: Result<ValidationError>, req: Request, status = 422) {
		const err = errors.array()[0];
		super(`Invalid ${err.location} parameter ${err.param} "${err.value}"`, req.originalUrl, err.nestedErrors?.length ? (err.nestedErrors[0] as ValidationError).msg : err.msg, status);
	}
}

export class AuthErrorJson extends ErrorObj implements Error {
	constructor (errors: Result<ValidationError>, req: Request, status = 401) {
		const err = errors.array({ onlyFirstError: true })[0];
		super("Authorization Error", req.originalUrl, `Invalid token "${err.value}"`, status);
	}
}

const authErrorHandler = (req: Request, res: Response, next: NextFunction): Response | undefined => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(401).json(new AuthErrorJson(errors, req));
	}
	next();
};

const validationErrorHandler = (req: Request, res: Response, next: NextFunction): Response | undefined => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json(new ValidationErrorJson(errors, req));
	}
	next();
};

const mongoVerifyExistance = (id: string, Collection: Model<Document<any>>): Promise<boolean> => {
	return Collection.exists({ _id: new mongoose.Types.ObjectId(id) });
};

const mongoVerifyBucketExistance = async (id: string, bucketName: string): Promise<boolean> => {
	return new Promise((resolve, reject) => {
		const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
			bucketName: bucketName
		});
		bucket.find({ _id: new mongoose.Types.ObjectId(id) }).toArray().then(res => {
			resolve(res.length > 0);
		}).catch(err => {
			reject(err);
		});
	});
};

const verifyUrlExistance = async (url: string): Promise<boolean> => {
	return new Promise((resolve, reject) => {
		axios.get(url).then(res => {
			resolve(res.status === 200);
		}).catch(err => {
			reject(err);
		});
	});
};

const mongoIdRegex = /^[a-fA-F0-9]{24}$/;
const youtubeIdRegex = /^[0-9A-Za-z_-]{10}[048AEIMQUYcgkosw]$/;
const spotifyIdRegex = /^[0-9A-Za-z]{22}$/;
const spotifyWebRegex = /^https?:\/\/open.spotify.com\/[a-zA-Z]+\/([0-9A-Za-z]{22})\?si=.*$/;
const spotifyURIRegex = /^spotify:[a-zA-Z]+:([0-9A-Za-z]{22})$/;

const youtubeIdValidator = (variable: ValidationChain): ValidationChain => variable.exists()
	.trim()
	.matches(youtubeIdRegex)
	.withMessage("youtube ID is not valid");

const mongoIdValidator = (variable: ValidationChain): ValidationChain => variable.exists()
	.trim()
	.matches(mongoIdRegex)
	.withMessage("internal ID is not valid");

const spotifyIdValidator = (variable: ValidationChain): ValidationChain => variable.exists()
	.trim()
	.matches(spotifyIdRegex)
	.withMessage("spotify ID is not valid");

export { mongoVerifyExistance, validationErrorHandler, mongoVerifyBucketExistance, verifyUrlExistance, mongoIdRegex, youtubeIdRegex, spotifyIdRegex, youtubeIdValidator, mongoIdValidator, spotifyIdValidator, spotifyWebRegex, spotifyURIRegex, authErrorHandler };
