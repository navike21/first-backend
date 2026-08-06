import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/blog/infrastructure/BlogModel', () => ({
	default: { findOne: vi.fn() },
}));

import { getBlogPostById } from '@Modules/blog/application/getBlogPostById';
import BlogModel from '@Modules/blog/infrastructure/BlogModel';
import { BlogNotFoundError } from '@Modules/blog/domain/errors/BlogErrors';

const mockPost = {
	id: '1',
	slug: 'post',
	status: 'draft',
	_id: 'mongo1',
};

describe('getBlogPostById', () => {
	it('returns the post regardless of status', async () => {
		vi.mocked(BlogModel.findOne).mockReturnValue({
			lean: vi.fn().mockResolvedValue(mockPost),
		} as never);

		const result = await getBlogPostById('1');

		expect(BlogModel.findOne).toHaveBeenCalledWith({
			id: '1',
			deletedAt: null,
		});
		expect(result.id).toBe('1');
		expect(result.status).toBe('draft');
	});

	it('throws BlogNotFoundError when not found or soft-deleted', async () => {
		vi.mocked(BlogModel.findOne).mockReturnValue({
			lean: vi.fn().mockResolvedValue(null),
		} as never);

		await expect(getBlogPostById('missing')).rejects.toThrow(BlogNotFoundError);
	});
});
