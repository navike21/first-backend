import { describe, it, expect } from 'vitest';
import {
	UserNotFoundError,
	EmailAlreadyExistsError,
	UserGroupNotFoundError,
} from '@Modules/users/domain/errors/UserErrors';
import { AppError } from '@Shared/domain/AppError';

describe('User domain errors', () => {
	it('UserNotFoundError has the correct code and status', () => {
		// Arrange & Act
		const error = new UserNotFoundError();

		// Assert
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(404);
		expect(error.code).toBe('USER_NOT_FOUND');
	});

	it('EmailAlreadyExistsError has the correct code and status', () => {
		// Arrange & Act
		const error = new EmailAlreadyExistsError();

		// Assert
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(409);
		expect(error.code).toBe('EMAIL_ALREADY_EXISTS');
	});

	it('UserGroupNotFoundError has the correct code and status', () => {
		// Arrange & Act
		const error = new UserGroupNotFoundError();

		// Assert
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(404);
		expect(error.code).toBe('USER_GROUP_NOT_FOUND');
	});
});
