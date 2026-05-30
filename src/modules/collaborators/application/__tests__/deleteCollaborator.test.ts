import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/collaborators/infrastructure/CollaboratorModel', () => ({
	default: { findOne: vi.fn() },
}));

import { deleteCollaborator } from '@Modules/collaborators/application/deleteCollaborator';
import CollaboratorModel from '@Modules/collaborators/infrastructure/CollaboratorModel';
import { CollaboratorNotFoundError } from '@Modules/collaborators/domain/errors/CollaboratorErrors';

describe('deleteCollaborator', () => {
	it('soft-deletes team member and returns data', async () => {
		const saveFn = vi.fn().mockResolvedValue(undefined);
		const doc = {
			id: '1',
			status: 'active',
			deletedAt: undefined as Date | undefined,
			save: saveFn,
			toObject: vi
				.fn()
				.mockReturnValue({ id: '1', status: 'deleted', _id: 'mongo1' }),
		};
		vi.mocked(CollaboratorModel.findOne).mockResolvedValue(doc as never);

		const result = await deleteCollaborator('1');

		expect(saveFn).toHaveBeenCalled();
		expect(doc.status).toBe('deleted');
		expect(doc.deletedAt).toBeInstanceOf(Date);
		expect(result).not.toHaveProperty('_id');
	});

	it('throws CollaboratorNotFoundError when member does not exist', async () => {
		vi.mocked(CollaboratorModel.findOne).mockResolvedValue(null as never);

		await expect(deleteCollaborator('not-found')).rejects.toThrow(
			CollaboratorNotFoundError,
		);
	});
});
