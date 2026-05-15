import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/team/infrastructure/TeamMemberModel', () => ({
	default: { findOne: vi.fn() },
}));

import { updateTeamMember } from '@Modules/team/application/updateTeamMember';
import TeamMemberModel from '@Modules/team/infrastructure/TeamMemberModel';
import { TeamMemberNotFoundError } from '@Modules/team/domain/errors/TeamErrors';

describe('updateTeamMember', () => {
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
		vi.mocked(TeamMemberModel.findOne).mockResolvedValue(doc as never);

		const result = await updateTeamMember('1', { name: 'New Name' });

		expect(saveFn).toHaveBeenCalled();
		expect(result).not.toHaveProperty('_id');
	});

	it('throws TeamMemberNotFoundError when member does not exist', async () => {
		vi.mocked(TeamMemberModel.findOne).mockResolvedValue(null as never);

		await expect(updateTeamMember('not-found', { name: 'X' })).rejects.toThrow(
			TeamMemberNotFoundError,
		);
	});
});
