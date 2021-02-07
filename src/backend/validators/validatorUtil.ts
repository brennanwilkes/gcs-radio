import { Result, ValidationError, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { ErrorObj, Error } from "../types/error";
import { mongoose } from "../../database/connection";
import { Model, Document } from "mongoose";
import axios from "axios";

export class ValidationErrorJson extends ErrorObj implements Error {
	constructor (errors: Result<ValidationError>, req: Request, status = 422) {
		const err = errors.array({ onlyFirstError: true })[0];
		super(`Invalid ${err.location} parameter ${err.param} "${err.value}"`, req.originalUrl, err.msg, status);
	}
}

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
		}).catch(_err => {
			resolve(false);
		});
	});
};

const mongoIdRegex = /^[a-fA-F0-9]{24}$/;
const youtubeIdRegex = /^[0-9A-Za-z_-]{10}[048AEIMQUYcgkosw]$/;

export { mongoVerifyExistance, validationErrorHandler, mongoVerifyBucketExistance, verifyUrlExistance, mongoIdRegex, youtubeIdRegex };
