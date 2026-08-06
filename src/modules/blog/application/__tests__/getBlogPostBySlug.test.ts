import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/blog/infrastructure/BlogModel', () => ({
	default: { findOne: vi.fn() },
}));
vi.mock('@Modules/collaborators/infrastructure/CollaboratorModel', () => ({
	default: { findOne: vi.fn() },
}));

import { getBlogPostBySlug } from '@Modules/blog/application/getBlogPostBySlug';
import BlogModel from '@Modules/blog/infrastructure/BlogModel';
import CollaboratorModel from '@Modules/collaborators/infrastructure/CollaboratorModel';
import { BlogNotFoundError } from '@Modules/blog/domain/errors/BlogErrors';

const mockPost = {
	id: '1',
	slug: 'post',
	authorId: 'author-uuid',
	_id: 'mongo1',
};

describe('getBlogPostBySlug', () => {
	it('returns the post with its author', async () => {
		vi.mocked(BlogModel.findOne).mockReturnValue({
			lean: vi.fn().mockResolvedValue(mockPost),
		} as never);
		vi.mocked(CollaboratorModel.findOne).mockReturnValue({
			select: vi.fn().mockReturnThis(),
			lean: vi
				.fn()
				.mockResolvedValue({ name: 'Jane Doe', role: 'Writer', _id: 'm2' }),
		} as never);

		const result = await getBlogPostBySlug('post');

		expect(result.slug).toBe('post');
		expect(result.author).toBeDefined();
	});

	it('returns null author when authorId missing', async () => {
		vi.mocked(BlogModel.findOne).mockReturnValue({
			lean: vi.fn().mockResolvedValue({ ...mockPost, authorId: undefined }),
		} as never);

		const result = await getBlogPostBySlug('post');

		expect(result.author).toBeNull();
	});

	it('throws BlogNotFoundError when not found', async () => {
		vi.mocked(BlogModel.findOne).mockReturnValue({
			lean: vi.fn().mockResolvedValue(null),
		} as never);

		await expect(getBlogPostBySlug('not-found')).rejects.toThrow(
			BlogNotFoundError,
		);
	});
});
