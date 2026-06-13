import { describe, it, expect } from 'vitest';
import {
	ClientNotFoundError,
	ClientDuplicateDocumentError,
} from '@Modules/clients/domain/errors/ClientErrors';
import { AppError } from '@Shared/domain/AppError';

describe('Client domain errors', () => {
	it('ClientNotFoundError has correct code and status', () => {
		const error = new ClientNotFoundError();
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(404);
		expect(error.code).toBe('CLIENT_NOT_FOUND');
	});

	it('ClientDuplicateDocumentError maps to 409 RESOURCE_DUPLICATE with the key names', () => {
		const error = new ClientDuplicateDocumentError();
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(409);
		expect(error.code).toBe('RESOURCE_DUPLICATE');
		expect(error.details).toEqual({
			keys: ['documentType', 'documentNumber', 'country'],
		});
	});
});
