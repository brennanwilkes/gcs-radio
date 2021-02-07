import { Result, ValidationError, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { ErrorObj, Error } from "../types/error";
import { mongoose } from "../../database/connection";
import { Model, Document } from "mongoose";

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

export { mongoVerifyExistance, validationErrorHandler, mongoVerifyBucketExistance };
