import { AppError } from '@Shared/domain/AppError';

export class ClientNotFoundError extends AppError {
	constructor() {
		super({
			statusCode: 404,
			code: 'CLIENT_NOT_FOUND',
			message: 'Client not found',
		});
	}
}

export class ClientBusinessNameConflictError extends AppError {
	constructor() {
		super({
			statusCode: 409,
			code: 'CLIENT_BUSINESS_NAME_CONFLICT',
			message: 'A client with this business name already exists',
		});
	}
}
