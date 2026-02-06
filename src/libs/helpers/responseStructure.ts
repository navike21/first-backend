import { formatISO } from 'date-fns';
import { Response } from 'express';
import { isDevelopmentEnvironment } from './systemEnvironment';
import { logError } from './log';

interface ApiResponse<T> {
	success: boolean;
	statusCode: number;
	message: string;
	data?: T;
	code?: string;
	error?: ApiError;
	meta?: Meta;
}

interface ApiError {
	code: string;
	details?: unknown;
}

interface Meta {
	timestamp: string;
	requestId?: string;
}

interface SuccessResponseOptions<T> {
	data: T;
	message?: string;
	statusCode?: number;
}

interface ErrorResponseOptions {
	statusCode: number;
	code: string;
	message: string;
	details?: unknown;
}

const { isDevelopment } = isDevelopmentEnvironment();

export const successResponse = <T>(
	res: Response,
	options: SuccessResponseOptions<T>,
): Response<ApiResponse<T>> => {
	const { data, message = 'OK', statusCode = 200 } = options;

	const response: ApiResponse<T> = {
		success: true,
		statusCode,
		message,
		data,
		meta: {
			timestamp: formatISO(new Date()),
		},
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
		success: false,
		statusCode,
		message,
		error,
		meta: {
			timestamp: formatISO(new Date()),
		},
	};

	if (isDevelopment) {
		logError(response);
	}

	return res.status(statusCode).json(response);
};
