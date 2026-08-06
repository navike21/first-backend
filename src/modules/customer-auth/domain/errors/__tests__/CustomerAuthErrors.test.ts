import { describe, it, expect } from 'vitest';
import {
	InvalidCustomerCredentialsError,
	CustomerAlreadyRegisteredError,
	CustomerInvalidTokenError,
	CustomerTokenReuseDetectedError,
} from '@Modules/customer-auth/domain/errors/CustomerAuthErrors';
import { AppError } from '@Shared/domain/AppError';

describe('customer-auth domain errors', () => {
	it('InvalidCustomerCredentialsError has correct code and status', () => {
		const error = new InvalidCustomerCredentialsError();
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(401);
		expect(error.code).toBe('INVALID_CREDENTIALS');
	});

	it('CustomerAlreadyRegisteredError maps to 409 RESOURCE_DUPLICATE', () => {
		const error = new CustomerAlreadyRegisteredError();
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(409);
		expect(error.code).toBe('RESOURCE_DUPLICATE');
		expect(error.details).toEqual({ keys: ['email'] });
	});

	it('CustomerInvalidTokenError has correct code and status', () => {
		const error = new CustomerInvalidTokenError();
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(401);
		expect(error.code).toBe('INVALID_TOKEN');
	});

	it('CustomerTokenReuseDetectedError has correct code and status', () => {
		const error = new CustomerTokenReuseDetectedError();
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(401);
		expect(error.code).toBe('TOKEN_REUSE_DETECTED');
	});
});
