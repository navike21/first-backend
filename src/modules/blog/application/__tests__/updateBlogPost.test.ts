import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/blog/infrastructure/BlogModel', () => ({
	default: { findOne: vi.fn() },
}));
vi.mock('@Modules/storage', () => ({
	uploadImageSafe: vi.fn(),
	deleteEntityFiles: vi.fn(),
	deleteStorageFilesByIds: vi.fn(),
}));

import { updateBlogPost } from '@Modules/blog/application/updateBlogPost';
import BlogModel from '@Modules/blog/infrastructure/BlogModel';
import {
	BlogNotFoundError,
	BlogSlugConflictError,
} from '@Modules/blog/domain/errors/BlogErrors';
import {
	uploadImageSafe,
	deleteEntityFiles,
	deleteStorageFilesByIds,
} from '@Modules/storage';

const makeDoc = (overrides: Record<string, unknown> = {}) => {
	const values: Record<string, unknown> = { id: '1', ...overrides };
	return {
		...values,
		set: vi.fn((field: string, value: unknown) => {
			values[field] = value;
		}),
		save: vi.fn().mockResolvedValue(undefined),
		toObject: vi.fn(() => ({ ...values, _id: 'm1' })),
	};
};

describe('updateBlogPost', () => {
	beforeEach(() => {
		vi.mocked(deleteEntityFiles).mockResolvedValue(undefined);
		vi.mocked(deleteStorageFilesByIds).mockResolvedValue(undefined);
	});

	it('updates and returns the post', async () => {
		const doc = makeDoc({ status: 'draft' });
		vi.mocked(BlogModel.findOne).mockResolvedValue(doc as never);

		const result = await updateBlogPost('1', { status: 'published' }, undefined, undefined);

		expect(doc.save).toHaveBeenCalled();
		expect(result.data).not.toHaveProperty('_id');
	});

	it('throws BlogNotFoundError when not found', async () => {
		vi.mocked(BlogModel.findOne).mockResolvedValue(null as never);

		await expect(
			updateBlogPost('not-found', {}, undefined, undefined),
		).rejects.toThrow(BlogNotFoundError);
	});

	it('throws BlogSlugConflictError on duplicate slug', async () => {
		const doc = makeDoc();
		const conflict = { id: '2', slug: { en: 'taken' } };
		vi.mocked(BlogModel.findOne)
			.mockResolvedValueOnce(doc as never)
			.mockResolvedValueOnce(conflict as never);

		await expect(
			updateBlogPost('1', { slug: { en: 'taken' } }, undefined, undefined),
		).rejects.toThrow(BlogSlugConflictError);
	});

	it('scopes cover cleanup to field:cover, leaving ogImage alone', async () => {
		const doc = makeDoc();
		vi.mocked(BlogModel.findOne).mockResolvedValue(doc as never);
		vi.mocked(uploadImageSafe).mockResolvedValueOnce({
			url: 'https://cdn/new-cover.jpg',
			storageId: 'cover-new',
		});

		await updateBlogPost(
			'1',
			{},
			{ cover: { buffer: Buffer.from('c'), originalName: 'c.jpg', mimeType: 'image/jpeg' } },
			'user-1',
		);

		expect(deleteEntityFiles).toHaveBeenCalledWith('blog', '1', {
			field: 'cover',
			exceptStorageIds: ['cover-new'],
		});
	});

	it('clears seo.ogImage when an empty string is sent without a replacement file', async () => {
		const doc = makeDoc({ seo: { ogImage: 'https://cdn/old-og.jpg' } });
		vi.mocked(BlogModel.findOne).mockResolvedValue(doc as never);

		await updateBlogPost('1', { seo: { ogImage: '' } }, undefined, undefined);

		expect(doc.set).toHaveBeenCalledWith('seo.ogImage', undefined);
		expect(deleteEntityFiles).toHaveBeenCalledWith('blog', '1', {
			field: 'ogImage',
		});
	});

	it('compensates newly uploaded files when save fails', async () => {
		const doc = makeDoc();
		doc.save = vi.fn().mockRejectedValue(new Error('db down'));
		vi.mocked(BlogModel.findOne).mockResolvedValue(doc as never);
		vi.mocked(uploadImageSafe).mockResolvedValueOnce({
			url: 'https://cdn/new.jpg',
			storageId: 'new-1',
		});

		await expect(
			updateBlogPost(
				'1',
				{},
				{ cover: { buffer: Buffer.from('c'), originalName: 'c.jpg', mimeType: 'image/jpeg' } },
				'user-1',
			),
		).rejects.toThrow('db down');

		expect(deleteStorageFilesByIds).toHaveBeenCalledWith(['new-1']);
	});
});
