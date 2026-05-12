import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/team/infrastructure/TeamMemberModel', () => ({
	default: { findOne: vi.fn() },
}));

import { deleteTeamMember } from '@Modules/team/application/deleteTeamMember';
import TeamMemberModel from '@Modules/team/infrastructure/TeamMemberModel';
import { TeamMemberNotFoundError } from '@Modules/team/domain/errors/TeamErrors';

describe('deleteTeamMember', () => {
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
		vi.mocked(TeamMemberModel.findOne).mockResolvedValue(doc as never);

		const result = await deleteTeamMember('1');

		expect(saveFn).toHaveBeenCalled();
		expect(doc.status).toBe('deleted');
		expect(doc.deletedAt).toBeInstanceOf(Date);
		expect(result).not.toHaveProperty('_id');
	});

	it('throws TeamMemberNotFoundError when member does not exist', async () => {
		vi.mocked(TeamMemberModel.findOne).mockResolvedValue(null as never);

		await expect(deleteTeamMember('not-found')).rejects.toThrow(
			TeamMemberNotFoundError,
		);
	});
});
