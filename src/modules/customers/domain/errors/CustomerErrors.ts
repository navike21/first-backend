import { AppError } from '@Shared/domain/AppError';

export class CustomerNotFoundError extends AppError {
	constructor() {
		super({
			statusCode: 404,
			code: 'CUSTOMER_NOT_FOUND',
			message: 'CUSTOMER_NOT_FOUND',
		});
	}
}

/**
 * Raised when a customer with the same email already exists. Uses the shared
 * RESOURCE_DUPLICATE code so the pre-check and the unique-index (E11000)
 * safety net surface identically — same precedent as
 * `ClientDuplicateDocumentError`.
 */
export class CustomerEmailConflictError extends AppError {
	constructor() {
		super({
			statusCode: 409,
			code: 'RESOURCE_DUPLICATE',
			message: 'A customer with this email already exists',
			details: { keys: ['email'] },
		});
	}
}
