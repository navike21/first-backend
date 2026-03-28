import { errorResponse as errorResponseSend } from '@Helpers/responseStructure';
import { ErrorResponseOptions } from '@Types/responseStructure';
import type { NextFunction, Request, Response } from 'express';

interface CustomError extends ErrorResponseOptions {
	errorResponse: unknown;
}

export const errorMiddleware = (
	error: unknown,
	_: Request,
	res: Response,
	_next: NextFunction,
) => {
	const errorData = JSON.stringify(error);
	const errorDataMongoose = JSON.parse(errorData) as CustomError;

	if (Object.keys(errorDataMongoose).length) {
		const { code, statusCode, message, details, errorResponse } =
			errorDataMongoose;
		return errorResponseSend(res, {
			statusCode: statusCode || 500,
			code,
			message,
			details:
				message ||
				(error instanceof Error && error.message) ||
				errorResponse ||
				details,
		});
	}

	const genericError = error as Error;
	const errorDataGeneric = JSON.parse(
		genericError.message,
	) as ErrorResponseOptions;

	if (Object.keys(errorDataGeneric).length) {
		const { code, message, statusCode, details } = errorDataGeneric;
		return errorResponseSend(res, {
			statusCode: statusCode || 500,
			code,
			message,
			details,
		});
	}
};
