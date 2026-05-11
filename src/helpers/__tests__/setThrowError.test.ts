import { describe, it, expect } from 'vitest';
import setThrowError from '@Helpers/setThrowError';
import { AppError } from '@Shared/domain/AppError';

describe('setThrowError', () => {
	it('throws an AppError with the provided statusCode, code, and message', () => {
		// Arrange
		const errorData = {
			statusCode: 404,
			code: 'RESOURCE_NOT_FOUND',
			message: 'Resource not found',
		};

		// Act & Assert
		expect(() => setThrowError(errorData)).toThrow(AppError);
	});

	it('includes the correct statusCode on the thrown error', () => {
		// Arrange
		const errorData = {
			statusCode: 409,
			code: 'CONFLICT',
			message: 'Conflict occurred',
		};

		// Act & Assert
		try {
			setThrowError(errorData);
		} catch (err) {
			expect(err).toBeInstanceOf(AppError);
			expect((err as AppError).statusCode).toBe(409);
			expect((err as AppError).code).toBe('CONFLICT');
		}
	});

	it('includes optional details on the thrown error', () => {
		// Arrange
		const errorData = {
			statusCode: 400,
			code: 'VALIDATION_ERROR',
			message: 'Validation failed',
			details: { field: 'email' },
		};

		// Act & Assert
		try {
			setThrowError(errorData);
		} catch (err) {
			expect((err as AppError).details).toEqual({ field: 'email' });
		}
	});
});
