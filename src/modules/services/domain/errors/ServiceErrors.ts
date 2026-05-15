import { AppError } from '@Shared/domain/AppError';

export class ServiceNotFoundError extends AppError {
	constructor() {
		super({
			statusCode: 404,
			code: 'SERVICE_NOT_FOUND',
			message: 'Service not found',
		});
	}
}

export class ServiceSlugConflictError extends AppError {
	constructor() {
		super({
			statusCode: 409,
			code: 'SERVICE_SLUG_CONFLICT',
			message: 'A service with this slug already exists',
		});
	}
}
