import { AppError } from '@Shared/domain/AppError';

export class TagNotFoundError extends AppError {
	constructor() {
		super({
			statusCode: 404,
			code: 'TAG_NOT_FOUND',
			message: 'TAG_NOT_FOUND',
		});
	}
}

export class TagSlugConflictError extends AppError {
	constructor() {
		super({
			statusCode: 409,
			code: 'TAG_SLUG_CONFLICT',
			message: 'TAG_SLUG_CONFLICT',
		});
	}
}
