import { describe, it, expect } from 'vitest';
import {
	ClientNotFoundError,
	ClientBusinessNameConflictError,
} from '@Modules/clients/domain/errors/ClientErrors';
import { AppError } from '@Shared/domain/AppError';

describe('Client domain errors', () => {
	it('ClientNotFoundError has correct code and status', () => {
		const error = new ClientNotFoundError();
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(404);
		expect(error.code).toBe('CLIENT_NOT_FOUND');
	});

	it('ClientBusinessNameConflictError has correct code and status', () => {
		const error = new ClientBusinessNameConflictError();
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(409);
		expect(error.code).toBe('CLIENT_BUSINESS_NAME_CONFLICT');
	});
});
