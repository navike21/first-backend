import { describe, it, expect } from 'vitest';
import {
	CustomerNotFoundError,
	CustomerEmailConflictError,
} from '@Modules/customers/domain/errors/CustomerErrors';
import { AppError } from '@Shared/domain/AppError';

describe('Customer domain errors', () => {
	it('CustomerNotFoundError has correct code and status', () => {
		const error = new CustomerNotFoundError();
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(404);
		expect(error.code).toBe('CUSTOMER_NOT_FOUND');
	});

	it('CustomerEmailConflictError maps to 409 RESOURCE_DUPLICATE with the key names', () => {
		const error = new CustomerEmailConflictError();
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(409);
		expect(error.code).toBe('RESOURCE_DUPLICATE');
		expect(error.details).toEqual({ keys: ['email'] });
	});
});
