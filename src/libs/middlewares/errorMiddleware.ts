import { logError } from '@Helpers/log';
import { errorResponse as errorResponseSend } from '@Helpers/responseStructure';
import { ErrorResponseOptions } from '@Types/responseStructure';
import type { NextFunction, Request, Response } from 'express';
import { Error } from 'mongoose';

interface CustomError extends ErrorResponseOptions {
	errorResponse: unknown;
}

export const errorMiddleware = (
	error: unknown,
	_: Request,
	res: Response,
	_next: NextFunction,
) => {
	const errorData = JSON.stringify(error as Error);

	const { code, message, statusCode, details, errorResponse } = JSON.parse(
		errorData,
	) as CustomError;

	logError(details || message);

	errorResponseSend(res, {
		statusCode: statusCode || 500,
		code,
		message,
		details: errorResponse || details,
	});
};
