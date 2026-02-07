import { formatISO } from 'date-fns';
import { Response } from 'express';
import { isDevelopmentEnvironment } from './systemEnvironment';
import { logError } from './log';
import {
	ApiError,
	ApiResponse,
	ErrorResponseOptions,
	SuccessResponseOptions,
} from '@Types/responseStructure';

const { isDevelopment } = isDevelopmentEnvironment();

export const successResponse = <T>(
	res: Response,
	options: SuccessResponseOptions<T>,
): Response<ApiResponse<T>> => {
	const { data, message = 'OK', statusCode = 200, code } = options;

	const response: ApiResponse<T> = {
		code,
		data,
		message,
		meta: {
			timestamp: formatISO(new Date()),
		},
		statusCode,
		success: true,
	};

	return res.status(statusCode).json(response);
};

export const errorResponse = (
	res: Response,
	options: ErrorResponseOptions,
): Response<ApiResponse<null>> => {
	const { statusCode, code, message, details } = options;

	const error: ApiError = {
		code,
		details,
	};

	const response: ApiResponse<null> = {
		error,
		message,
		meta: {
			timestamp: formatISO(new Date()),
		},
		statusCode,
		success: false,
	};

	if (isDevelopment) {
		logError(response);
	}

	return res.status(statusCode).json(response);
};
