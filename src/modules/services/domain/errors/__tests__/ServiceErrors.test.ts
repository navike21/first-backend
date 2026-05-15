import { describe, it, expect } from 'vitest';
import {
	ServiceNotFoundError,
	ServiceSlugConflictError,
} from '@Modules/services/domain/errors/ServiceErrors';
import { AppError } from '@Shared/domain/AppError';

describe('Service domain errors', () => {
	it('ServiceNotFoundError has correct code and status', () => {
		const error = new ServiceNotFoundError();
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(404);
		expect(error.code).toBe('SERVICE_NOT_FOUND');
	});

	it('ServiceSlugConflictError has correct code and status', () => {
		const error = new ServiceSlugConflictError();
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(409);
		expect(error.code).toBe('SERVICE_SLUG_CONFLICT');
	});
});
