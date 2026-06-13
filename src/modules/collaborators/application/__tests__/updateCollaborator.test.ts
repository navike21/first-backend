import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/collaborators/infrastructure/CollaboratorModel', () => ({
	default: { findOne: vi.fn() },
}));

import { updateCollaborator } from '@Modules/collaborators/application/updateCollaborator';
import CollaboratorModel from '@Modules/collaborators/infrastructure/CollaboratorModel';
import { CollaboratorNotFoundError } from '@Modules/collaborators/domain/errors/CollaboratorErrors';

describe('updateCollaborator', () => {
	it('updates and returns team member', async () => {
		const saveFn = vi.fn().mockResolvedValue(undefined);
		const doc = {
			id: '1',
			name: 'Old Name',
			save: saveFn,
			toObject: vi
				.fn()
				.mockReturnValue({ id: '1', name: 'New Name', _id: 'mongo1' }),
		};
		vi.mocked(CollaboratorModel.findOne).mockResolvedValue(doc as never);

		const result = await updateCollaborator('1', { name: 'New Name' });

		expect(saveFn).toHaveBeenCalled();
		expect(result.data).not.toHaveProperty('_id');
	});

	it('throws CollaboratorNotFoundError when member does not exist', async () => {
		vi.mocked(CollaboratorModel.findOne).mockResolvedValue(null as never);

		await expect(updateCollaborator('not-found', { name: 'X' })).rejects.toThrow(
			CollaboratorNotFoundError,
		);
	});
});
