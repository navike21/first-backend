import { AppError } from '@Shared/domain/AppError';

export class UserGroupNotFoundError extends AppError {
	constructor() {
		super({
			statusCode: 404,
			code: 'USER_GROUP_NOT_FOUND',
			message: 'User group not found',
		});
	}
}

export class UserGroupSlugConflictError extends AppError {
	constructor() {
		super({
			statusCode: 409,
			code: 'USER_GROUP_SLUG_CONFLICT',
			message: 'A user group with this name already exists',
		});
	}
}

export class SystemGroupModificationError extends AppError {
	constructor() {
		super({
			statusCode: 403,
			code: 'USER_GROUP_SYSTEM_PROTECTED',
			message: 'System groups cannot be modified or deleted',
		});
	}
}
