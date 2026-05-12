import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/team/infrastructure/TeamMemberModel', () => ({
	default: { find: vi.fn(), countDocuments: vi.fn() },
}));

import { listTeamMembers } from '@Modules/team/application/listTeamMembers';
import TeamMemberModel from '@Modules/team/infrastructure/TeamMemberModel';

const mockQueryBuilder = (items: unknown[]) => ({
	sort: vi.fn().mockReturnThis(),
	skip: vi.fn().mockReturnThis(),
	limit: vi.fn().mockReturnThis(),
	lean: vi.fn().mockResolvedValue(items),
});

const member = { id: '1', name: 'Jane', status: 'active', _id: 'mongo1' };

describe('listTeamMembers', () => {
	it('returns paginated public members', async () => {
		vi.mocked(TeamMemberModel.find).mockReturnValue(
			mockQueryBuilder([member]) as never,
		);
		vi.mocked(TeamMemberModel.countDocuments).mockResolvedValue(1);

		const result = await listTeamMembers({ page: 1, limit: 10 });

		expect(result.data).toHaveLength(1);
		expect(result.data[0]).not.toHaveProperty('_id');
		expect(result.meta.total).toBe(1);
	});

	it('uses status ne deleted filter for adminView', async () => {
		vi.mocked(TeamMemberModel.find).mockReturnValue(
			mockQueryBuilder([member]) as never,
		);
		vi.mocked(TeamMemberModel.countDocuments).mockResolvedValue(1);

		const result = await listTeamMembers({
			page: 1,
			limit: 10,
			adminView: true,
		});

		expect(TeamMemberModel.find).toHaveBeenCalledWith({
			status: { $ne: 'deleted' },
		});
		expect(result.data).toHaveLength(1);
	});

	it('uses active + isActive filter for public view', async () => {
		vi.mocked(TeamMemberModel.find).mockReturnValue(
			mockQueryBuilder([member]) as never,
		);
		vi.mocked(TeamMemberModel.countDocuments).mockResolvedValue(1);

		await listTeamMembers({ page: 1, limit: 10, adminView: false });

		expect(TeamMemberModel.find).toHaveBeenCalledWith({
			status: 'active',
			isActive: true,
		});
	});

	it('returns correct meta pagination', async () => {
		vi.mocked(TeamMemberModel.find).mockReturnValue(
			mockQueryBuilder([member, member]) as never,
		);
		vi.mocked(TeamMemberModel.countDocuments).mockResolvedValue(25);

		const result = await listTeamMembers({ page: 2, limit: 10 });

		expect(result.meta.page).toBe(2);
		expect(result.meta.limit).toBe(10);
		expect(result.meta.total).toBe(25);
		expect(result.meta.totalPages).toBe(3);
	});
});
