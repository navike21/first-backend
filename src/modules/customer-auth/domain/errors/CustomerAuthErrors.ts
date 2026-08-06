import { AppError } from '@Shared/domain/AppError';

export class InvalidCustomerCredentialsError extends AppError {
	constructor() {
		super({
			statusCode: 401,
			code: 'INVALID_CREDENTIALS',
			message: 'Invalid email or password',
		});
	}
}

export class CustomerAlreadyRegisteredError extends AppError {
	constructor() {
		super({
			statusCode: 409,
			code: 'RESOURCE_DUPLICATE',
			message: 'A customer with this email already exists',
			details: { keys: ['email'] },
		});
	}
}

export class CustomerInvalidTokenError extends AppError {
	constructor() {
		super({
			statusCode: 401,
			code: 'INVALID_TOKEN',
			message: 'Invalid or expired token',
		});
	}
}

export class CustomerTokenReuseDetectedError extends AppError {
	constructor() {
		super({
			statusCode: 401,
			code: 'TOKEN_REUSE_DETECTED',
			message: 'Security violation detected. All sessions have been revoked',
		});
	}
}
