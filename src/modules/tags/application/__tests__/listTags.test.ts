import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/tags/infrastructure/TagModel', () => ({
	default: { find: vi.fn(), countDocuments: vi.fn() },
}));

import { listTags } from '@Modules/tags/application/listTags';
import TagModel from '@Modules/tags/infrastructure/TagModel';

const mockQueryBuilder = (items: unknown[]) => ({
	sort: vi.fn().mockReturnThis(),
	skip: vi.fn().mockReturnThis(),
	limit: vi.fn().mockReturnThis(),
	lean: vi.fn().mockResolvedValue(items),
});

const tag = { id: '1', slug: 'featured', status: 'active', _id: 'mongo1' };

describe('listTags', () => {
	it('uses the active+isActive+deletedAt filter for the public view', async () => {
		vi.mocked(TagModel.find).mockReturnValue(mockQueryBuilder([tag]) as never);
		vi.mocked(TagModel.countDocuments).mockResolvedValue(1);

		await listTags({ page: 1, limit: 10, adminView: false });

		expect(TagModel.find).toHaveBeenCalledWith({
			status: 'active',
			isActive: true,
			deletedAt: null,
		});
	});

	it('uses the deletedAt null filter for adminView', async () => {
		vi.mocked(TagModel.find).mockReturnValue(mockQueryBuilder([tag]) as never);
		vi.mocked(TagModel.countDocuments).mockResolvedValue(1);

		const result = await listTags({ page: 1, limit: 10, adminView: true });

		expect(TagModel.find).toHaveBeenCalledWith({ deletedAt: null });
		expect(result.data[0]).not.toHaveProperty('_id');
	});
});
