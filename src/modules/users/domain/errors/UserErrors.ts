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

export class CannotDeleteSelfError extends AppError {
	constructor() {
		super({
			statusCode: 403,
			code: 'CANNOT_DELETE_SELF',
			message: 'You cannot delete your own account',
		});
	}
}

export class LastSuperAdminError extends AppError {
	constructor() {
		super({
			statusCode: 409,
			code: 'LAST_SUPER_ADMIN',
			message: 'The last super-admin cannot be deleted',
		});
	}
}
