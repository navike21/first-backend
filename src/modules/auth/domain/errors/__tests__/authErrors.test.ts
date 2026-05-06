import { describe, it, expect } from 'vitest';
import {
	InvalidCredentialsError,
	EmailNotVerifiedError,
	InvalidTokenError,
	TokenReuseDetectedError,
} from '@Modules/auth/domain/errors/AuthErrors';
import { AppError } from '@Shared/domain/AppError';

describe('Auth domain errors', () => {
	it('InvalidCredentialsError has the correct code and status', () => {
		// Arrange & Act
		const error = new InvalidCredentialsError();

		// Assert
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(401);
		expect(error.code).toBe('INVALID_CREDENTIALS');
	});

	it('EmailNotVerifiedError has the correct code and status', () => {
		// Arrange & Act
		const error = new EmailNotVerifiedError();

		// Assert
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(403);
		expect(error.code).toBe('EMAIL_NOT_VERIFIED');
	});

	it('InvalidTokenError has the correct code and status', () => {
		// Arrange & Act
		const error = new InvalidTokenError();

		// Assert
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(401);
		expect(error.code).toBe('INVALID_TOKEN');
	});

	it('TokenReuseDetectedError has the correct code and status', () => {
		// Arrange & Act
		const error = new TokenReuseDetectedError();

		// Assert
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(401);
		expect(error.code).toBe('TOKEN_REUSE_DETECTED');
	});
});
