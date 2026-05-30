import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/collaborators/infrastructure/CollaboratorModel', () => ({
	default: { findOne: vi.fn() },
}));

import { getCollaboratorById } from '@Modules/collaborators/application/getCollaboratorById';
import CollaboratorModel from '@Modules/collaborators/infrastructure/CollaboratorModel';
import { CollaboratorNotFoundError } from '@Modules/collaborators/domain/errors/CollaboratorErrors';

const mockQueryBuilder = (result: unknown) => ({
	lean: vi.fn().mockResolvedValue(result),
});

describe('getCollaboratorById', () => {
	it('returns team member data when found', async () => {
		vi.mocked(CollaboratorModel.findOne).mockReturnValue(
			mockQueryBuilder({
				id: '1',
				name: 'Jane',
				_id: 'mongo1',
			}) as never,
		);

		const result = await getCollaboratorById('1');

		expect(result).not.toHaveProperty('_id');
		expect(result.name).toBe('Jane');
	});

	it('throws CollaboratorNotFoundError when not found', async () => {
		vi.mocked(CollaboratorModel.findOne).mockReturnValue(
			mockQueryBuilder(null) as never,
		);

		await expect(getCollaboratorById('not-found')).rejects.toThrow(
			CollaboratorNotFoundError,
		);
	});
});
