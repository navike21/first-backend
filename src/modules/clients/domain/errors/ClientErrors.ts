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

/**
 * Raised when a client with the same document (documentType + documentNumber +
 * country) already exists. Uses the shared RESOURCE_DUPLICATE code so the
 * pre-check and the unique-index (E11000) safety net surface identically.
 */
export class ClientDuplicateDocumentError extends AppError {
	constructor() {
		super({
			statusCode: 409,
			code: 'RESOURCE_DUPLICATE',
			message: 'A client with this document already exists',
			details: { keys: ['documentType', 'documentNumber', 'country'] },
		});
	}
}
