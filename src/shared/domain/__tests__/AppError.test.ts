import { describe, it, expect } from 'vitest';
import { AppError } from '@Shared/domain/AppError';

describe('AppError', () => {
	it('sets statusCode, code, and message from constructor input', () => {
		// Arrange & Act
		const error = new AppError({
			statusCode: 404,
			code: 'NOT_FOUND',
			message: 'Resource not found',
		});

		// Assert
		expect(error.statusCode).toBe(404);
		expect(error.code).toBe('NOT_FOUND');
		expect(error.message).toBe('Resource not found');
	});

	it('is an instance of Error', () => {
		// Arrange & Act
		const error = new AppError({
			statusCode: 500,
			code: 'ERR',
			message: 'err',
		});

		// Assert
		expect(error).toBeInstanceOf(Error);
	});

	it('has name AppError', () => {
		// Arrange & Act
		const error = new AppError({
			statusCode: 400,
			code: 'BAD',
			message: 'bad',
		});

		// Assert
		expect(error.name).toBe('AppError');
	});

	it('stores optional details when provided', () => {
		// Arrange
		const details = { field: 'email', reason: 'duplicate' };

		// Act
		const error = new AppError({
			statusCode: 409,
			code: 'CONFLICT',
			message: 'Conflict',
			details,
		});

		// Assert
		expect(error.details).toEqual(details);
	});

	it('has undefined details when not provided', () => {
		// Arrange & Act
		const error = new AppError({
			statusCode: 400,
			code: 'BAD',
			message: 'bad',
		});

		// Assert
		expect(error.details).toBeUndefined();
	});
});
