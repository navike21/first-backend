import { logInfo } from '@Helpers/log';
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
	logInfo(
		`Error captured by errorMiddleware: ${error instanceof Error ? error.message : JSON.stringify(error)}`,
	);

	// Intentar parsear como error estructurado (Mongoose, custom errors)
	try {
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
	} catch {
		// Si falla el parse, continuar con el siguiente intento
	}

	// Intentar parsear el mensaje como JSON (custom errors con JSON en el mensaje)
	if (error instanceof Error) {
		try {
			const errorDataGeneric = JSON.parse(
				error.message,
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
		} catch {
			// Si falla el parse, es un error estándar - continuar al fallback
		}
	}

	// Fallback para errores estándar (CORS, validación, etc.)
	if (error instanceof Error) {
		return errorResponseSend(res, {
			statusCode: 403,
			code: 'FORBIDDEN',
			message: error.message,
			details: error.message,
		});
	}

	// Fallback genérico para errores desconocidos
	return errorResponseSend(res, {
		statusCode: 500,
		code: 'INTERNAL_SERVER_ERROR',
		message: 'An unexpected error occurred',
		details: String(error),
	});
};
