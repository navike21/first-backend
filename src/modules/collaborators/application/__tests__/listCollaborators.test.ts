import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/collaborators/infrastructure/CollaboratorModel', () => ({
	default: { find: vi.fn(), countDocuments: vi.fn() },
}));

import { listCollaborators } from '@Modules/collaborators/application/listCollaborators';
import CollaboratorModel from '@Modules/collaborators/infrastructure/CollaboratorModel';

const mockQueryBuilder = (items: unknown[]) => ({
	sort: vi.fn().mockReturnThis(),
	skip: vi.fn().mockReturnThis(),
	limit: vi.fn().mockReturnThis(),
	lean: vi.fn().mockResolvedValue(items),
});

const member = { id: '1', name: 'Jane', status: 'active', _id: 'mongo1' };

describe('listCollaborators', () => {
	it('returns paginated public members', async () => {
		vi.mocked(CollaboratorModel.find).mockReturnValue(
			mockQueryBuilder([member]) as never,
		);
		vi.mocked(CollaboratorModel.countDocuments).mockResolvedValue(1);

		const result = await listCollaborators({ page: 1, limit: 10 });

		expect(result.data).toHaveLength(1);
		expect(result.data[0]).not.toHaveProperty('_id');
		expect(result.meta.total).toBe(1);
	});

	it('uses the deletedAt null filter for adminView', async () => {
		vi.mocked(CollaboratorModel.find).mockReturnValue(
			mockQueryBuilder([member]) as never,
		);
		vi.mocked(CollaboratorModel.countDocuments).mockResolvedValue(1);

		const result = await listCollaborators({
			page: 1,
			limit: 10,
			adminView: true,
		});

		expect(CollaboratorModel.find).toHaveBeenCalledWith({
			deletedAt: null,
		});
		expect(result.data).toHaveLength(1);
	});

	it('uses active + isActive + deletedAt filter for public view', async () => {
		vi.mocked(CollaboratorModel.find).mockReturnValue(
			mockQueryBuilder([member]) as never,
		);
		vi.mocked(CollaboratorModel.countDocuments).mockResolvedValue(1);

		await listCollaborators({ page: 1, limit: 10, adminView: false });

		expect(CollaboratorModel.find).toHaveBeenCalledWith({
			status: 'active',
			isActive: true,
			deletedAt: null,
		});
	});

	it('adds a case-insensitive name regex filter when search is given', async () => {
		vi.mocked(CollaboratorModel.find).mockReturnValue(
			mockQueryBuilder([member]) as never,
		);
		vi.mocked(CollaboratorModel.countDocuments).mockResolvedValue(1);

		await listCollaborators({
			page: 1,
			limit: 10,
			adminView: true,
			search: 'Jane',
		});

		expect(CollaboratorModel.find).toHaveBeenCalledWith({
			deletedAt: null,
			name: { $regex: 'Jane', $options: 'i' },
		});
	});

	it('filters by isActive for adminView', async () => {
		vi.mocked(CollaboratorModel.find).mockReturnValue(
			mockQueryBuilder([member]) as never,
		);
		vi.mocked(CollaboratorModel.countDocuments).mockResolvedValue(1);

		await listCollaborators({
			page: 1,
			limit: 10,
			adminView: true,
			isActive: false,
		});

		expect(CollaboratorModel.find).toHaveBeenCalledWith({
			deletedAt: null,
			isActive: false,
		});
	});

	it('ignores isActive for the public view (already forced true)', async () => {
		vi.mocked(CollaboratorModel.find).mockReturnValue(
			mockQueryBuilder([member]) as never,
		);
		vi.mocked(CollaboratorModel.countDocuments).mockResolvedValue(1);

		await listCollaborators({
			page: 1,
			limit: 10,
			adminView: false,
			isActive: false,
		});

		expect(CollaboratorModel.find).toHaveBeenCalledWith({
			status: 'active',
			isActive: true,
			deletedAt: null,
		});
	});

	it('returns correct meta pagination', async () => {
		vi.mocked(CollaboratorModel.find).mockReturnValue(
			mockQueryBuilder([member, member]) as never,
		);
		vi.mocked(CollaboratorModel.countDocuments).mockResolvedValue(25);

		const result = await listCollaborators({ page: 2, limit: 10 });

		expect(result.meta.page).toBe(2);
		expect(result.meta.limit).toBe(10);
		expect(result.meta.total).toBe(25);
		expect(result.meta.totalPages).toBe(3);
	});
});
