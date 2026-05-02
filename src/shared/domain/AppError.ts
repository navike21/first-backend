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
}
