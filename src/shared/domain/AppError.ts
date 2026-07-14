import { ErrorResponseOptions } from '@Types/responseStructure';

export class AppError extends Error {
	readonly statusCode: number;
	readonly code: string;
	readonly details?: unknown;

	constructor({ statusCode, code, message, details }: ErrorResponseOptions) {
		super(message);
		this.name = 'AppError';
		this.statusCode = statusCode;
		this.code = code;
		this.details = details;
		Error.captureStackTrace(this, this.constructor);
	}

	static badRequest(code: string, message: string, details?: unknown): never {
		throw new AppError({ statusCode: 400, code, message, details });
	}

	static unauthorized(code: string, message: string, details?: unknown): never {
		throw new AppError({ statusCode: 401, code, message, details });
	}

	static forbidden(code: string, message: string, details?: unknown): never {
		throw new AppError({ statusCode: 403, code, message, details });
	}

	static notFound(code: string, message: string, details?: unknown): never {
		throw new AppError({ statusCode: 404, code, message, details });
	}

	static conflict(code: string, message: string, details?: unknown): never {
		throw new AppError({ statusCode: 409, code, message, details });
	}

	static unsupportedMediaType(
		code: string,
		message: string,
		details?: unknown,
	): never {
		throw new AppError({ statusCode: 415, code, message, details });
	}

	static unprocessable(
		code: string,
		message: string,
		details?: unknown,
	): never {
		throw new AppError({ statusCode: 422, code, message, details });
	}

	static internal(code: string, message: string, details?: unknown): never {
		throw new AppError({ statusCode: 500, code, message, details });
	}
}
