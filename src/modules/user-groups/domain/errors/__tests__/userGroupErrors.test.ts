import { describe, it, expect } from 'vitest';
import {
	UserGroupNotFoundError,
	UserGroupSlugConflictError,
	SystemGroupModificationError,
} from '@Modules/user-groups/domain/errors/UserGroupErrors';
import { AppError } from '@Shared/domain/AppError';

describe('UserGroup domain errors', () => {
	it('UserGroupNotFoundError has the correct code and status', () => {
		// Arrange & Act
		const error = new UserGroupNotFoundError();

		// Assert
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(404);
		expect(error.code).toBe('USER_GROUP_NOT_FOUND');
	});

	it('UserGroupSlugConflictError has the correct code and status', () => {
		// Arrange & Act
		const error = new UserGroupSlugConflictError();

		// Assert
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(409);
		expect(error.code).toBe('USER_GROUP_SLUG_CONFLICT');
	});

	it('SystemGroupModificationError has the correct code and status', () => {
		// Arrange & Act
		const error = new SystemGroupModificationError();

		// Assert
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(403);
		expect(error.code).toBe('USER_GROUP_SYSTEM_PROTECTED');
	});
});
