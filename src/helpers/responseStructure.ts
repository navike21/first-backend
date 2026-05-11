import { formatISO } from 'date-fns';
import { Response } from 'express';
import { isDevelopmentEnvironment } from './systemEnvironment';
import { logError } from './log';
import i18next from '@Config/i18n';
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
	const { data, message = 'OK', ns, statusCode = 200, code, meta } = options;
	const lang = (res.locals.lang as string | undefined) ?? 'en';
	const translatedMessage = i18next.t(message, {
		lng: lang,
		ns,
		defaultValue: message,
	});

	const response: ApiResponse<T> = {
		code,
		data,
		message: translatedMessage,
		meta: {
			...meta,
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
			timestamp: formatISO(new Date(), {
				representation: 'complete',
				format: 'extended',
			}),
		},
		statusCode,
		success: false,
	};

	if (isDevelopment) {
		logError(response);
	}

	return res.status(statusCode).json(response);
};
