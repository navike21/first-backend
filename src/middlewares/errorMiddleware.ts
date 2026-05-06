import { AppError } from '@Shared/domain/AppError';
import { logError } from '@Helpers/log';
import { errorResponse } from '@Helpers/responseStructure';
import type { NextFunction, Request, Response } from 'express';
import i18next from '@Config/i18n';

export const errorMiddleware = (
	error: unknown,
	_req: Request,
	res: Response,
	_next: NextFunction,
) => {
	const lang = typeof res.locals.lang === 'string' ? res.locals.lang : 'en';
	if (error instanceof AppError) {
		const message = i18next.t(error.code, {
			lng: lang,
			defaultValue: error.message,
		});
		return errorResponse(res, {
			statusCode: error.statusCode,
			code: error.code,
			message,
			details: error.details,
		});
	}

	const errorMessage =
		error instanceof Error
			? `${error.message}\n${error.stack}`
			: String(error);

	logError(`Unhandled error: ${errorMessage}`);

	const message = i18next.t('INTERNAL_SERVER_ERROR', {
		lng: lang,
		defaultValue: 'An unexpected error occurred',
	});
	return errorResponse(res, {
		statusCode: 500,
		code: 'INTERNAL_SERVER_ERROR',
		message,
	});
};
