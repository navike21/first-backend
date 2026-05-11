import { AppError } from '@Shared/domain/AppError';

export class InvalidCredentialsError extends AppError {
	constructor() {
		super({
			statusCode: 401,
			code: 'INVALID_CREDENTIALS',
			message: 'Invalid email or password',
		});
	}
}

export class EmailNotVerifiedError extends AppError {
	constructor() {
		super({
			statusCode: 403,
			code: 'EMAIL_NOT_VERIFIED',
			message: 'Please verify your email before logging in',
		});
	}
}

export class InvalidTokenError extends AppError {
	constructor() {
		super({
			statusCode: 401,
			code: 'INVALID_TOKEN',
			message: 'Invalid or expired token',
		});
	}
}

export class TokenReuseDetectedError extends AppError {
	constructor() {
		super({
			statusCode: 401,
			code: 'TOKEN_REUSE_DETECTED',
			message: 'Security violation detected. All sessions have been revoked',
		});
	}
}
