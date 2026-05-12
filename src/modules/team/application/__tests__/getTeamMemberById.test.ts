import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/team/infrastructure/TeamMemberModel', () => ({
	default: { findOne: vi.fn() },
}));

import { getTeamMemberById } from '@Modules/team/application/getTeamMemberById';
import TeamMemberModel from '@Modules/team/infrastructure/TeamMemberModel';
import { TeamMemberNotFoundError } from '@Modules/team/domain/errors/TeamErrors';

const mockQueryBuilder = (result: unknown) => ({
	lean: vi.fn().mockResolvedValue(result),
});

describe('getTeamMemberById', () => {
	it('returns team member data when found', async () => {
		vi.mocked(TeamMemberModel.findOne).mockReturnValue(
			mockQueryBuilder({
				id: '1',
				name: 'Jane',
				_id: 'mongo1',
			}) as never,
		);

		const result = await getTeamMemberById('1');

		expect(result).not.toHaveProperty('_id');
		expect(result.name).toBe('Jane');
	});

	it('throws TeamMemberNotFoundError when not found', async () => {
		vi.mocked(TeamMemberModel.findOne).mockReturnValue(
			mockQueryBuilder(null) as never,
		);

		await expect(getTeamMemberById('not-found')).rejects.toThrow(
			TeamMemberNotFoundError,
		);
	});
});
