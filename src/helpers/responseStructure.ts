/**
 * @copyright Copyright navike21
 * @license Apache-2.0
 */
import { Response } from 'express';
import { formatISO } from 'date-fns';

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

export const successResponse = <T>(
	res: Response,
	options: SuccessResponseOptions<T>,
): Response<ApiResponse<T>> => {
	const { data, message = 'OK', statusCode = 200 } = options;

	// In the successResponse function:
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

	return res.status(statusCode).json(response);
};
