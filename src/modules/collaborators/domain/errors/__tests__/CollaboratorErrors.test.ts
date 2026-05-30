import { describe, it, expect } from 'vitest';
import { CollaboratorNotFoundError } from '@Modules/collaborators/domain/errors/CollaboratorErrors';
import { AppError } from '@Shared/domain/AppError';

describe('Team domain errors', () => {
	it('CollaboratorNotFoundError has correct code and status', () => {
		const error = new CollaboratorNotFoundError();
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(404);
		expect(error.code).toBe('COLLABORATOR_NOT_FOUND');
	});
});
