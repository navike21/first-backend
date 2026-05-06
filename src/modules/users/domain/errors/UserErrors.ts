import { AppError } from '@Shared/domain/AppError';

export class UserNotFoundError extends AppError {
	constructor() {
		super({
			statusCode: 404,
			code: 'USER_NOT_FOUND',
			message: 'User not found',
		});
	}
}

export class EmailAlreadyExistsError extends AppError {
	constructor() {
		super({
			statusCode: 409,
			code: 'EMAIL_ALREADY_EXISTS',
			message: 'An account with this email already exists',
		});
	}
}
