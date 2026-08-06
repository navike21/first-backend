import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/blog/infrastructure/BlogModel', () => ({
	default: { findOne: vi.fn(), create: vi.fn() },
}));
vi.mock('@Helpers/generateSlug', () => ({
	generateSlug: vi.fn().mockReturnValue('post-title'),
}));
vi.mock('@Modules/storage', () => ({
	uploadImageSafe: vi.fn(),
	deleteEntityFiles: vi.fn(),
}));
vi.mock('@Helpers/uuid', () => ({
	default: vi.fn().mockReturnValue('uuid-1'),
}));

import { createBlogPost } from '@Modules/blog/application/createBlogPost';
import BlogModel from '@Modules/blog/infrastructure/BlogModel';
import { BlogSlugConflictError } from '@Modules/blog/domain/errors/BlogErrors';
import { uploadImageSafe, deleteEntityFiles } from '@Modules/storage';

const incomingFile = (name: string) => ({
	buffer: Buffer.from(name),
	originalName: `${name}.jpg`,
	mimeType: 'image/jpeg',
});

const ls = {
	en: 'a',
	es: 'b',
	de: 'c',
	fr: 'd',
	it: 'e',
	ja: 'f',
	ko: 'g',
	pt: 'h',
	ru: 'i',
	zh: 'j',
};
const validInput = {
	title: ls,
	content: ls,
	coverImageUrl: 'https://example.com/cover.jpg',
	categoryIds: [],
	tagIds: [],
	status: 'draft' as const,
};

describe('createBlogPost', () => {
	it('creates a blog post and returns cleaned data', async () => {
		vi.mocked(BlogModel.findOne).mockResolvedValue(null);
		vi.mocked(BlogModel.create).mockResolvedValue({
			...validInput,
			id: 'uuid-1',
			slug: 'post-title',
			toObject: vi
				.fn()
				.mockReturnValue({ ...validInput, id: 'uuid-1', _id: 'mongo-1' }),
		} as never);

		const result = await createBlogPost(validInput, undefined);

		expect(BlogModel.create).toHaveBeenCalled();
		expect(result.data).not.toHaveProperty('_id');
		expect(result.warnings).toEqual([]);
	});

	it('throws BlogSlugConflictError when slug exists', async () => {
		vi.mocked(BlogModel.findOne).mockResolvedValue({ id: 'existing' } as never);

		await expect(createBlogPost(validInput, undefined)).rejects.toThrow(
			BlogSlugConflictError,
		);
	});

	it('throws when no cover image is provided (no file, no url)', async () => {
		vi.mocked(BlogModel.findOne).mockResolvedValue(null);
		const { coverImageUrl: _cover, ...withoutCover } = validInput;

		await expect(
			createBlogPost(withoutCover as typeof validInput, undefined),
		).rejects.toMatchObject({ code: 'BLOG_COVER_REQUIRED' });
		expect(BlogModel.create).not.toHaveBeenCalled();
	});

	it('throws BLOG_COVER_UPLOAD_FAILED when a cover file was provided but failed to upload', async () => {
		vi.mocked(BlogModel.findOne).mockResolvedValue(null);
		vi.mocked(uploadImageSafe).mockResolvedValueOnce({
			warning: {
				field: 'cover',
				code: 'IMAGE_UPLOAD_FAILED',
				message: 'The cover image is corrupted or in an unsupported format',
			},
		});
		const { coverImageUrl: _cover, ...withoutCover } = validInput;

		await expect(
			createBlogPost(
				withoutCover as typeof validInput,
				{ cover: incomingFile('cover') },
				'user-1',
			),
		).rejects.toMatchObject({
			code: 'BLOG_COVER_UPLOAD_FAILED',
			message: 'The cover image is corrupted or in an unsupported format',
		});
		expect(BlogModel.create).not.toHaveBeenCalled();
	});

	it('uploads a provided ogImage and stores it under seo.ogImage', async () => {
		vi.mocked(BlogModel.findOne).mockResolvedValue(null);
		vi.mocked(uploadImageSafe).mockResolvedValueOnce({
			url: 'https://cdn/og.jpg',
			storageId: 'og1',
		});
		vi.mocked(BlogModel.create).mockResolvedValue({
			toObject: vi.fn().mockReturnValue({ id: 'uuid-1', _id: 'mongo-1' }),
		} as never);

		await createBlogPost(
			validInput,
			{ ogImage: incomingFile('og') },
			'user-1',
		);

		expect(uploadImageSafe).toHaveBeenCalledWith(
			expect.objectContaining({ field: 'ogImage', uploadedBy: 'user-1' }),
		);
		expect(BlogModel.create).toHaveBeenCalledWith(
			expect.objectContaining({ seo: { ogImage: 'https://cdn/og.jpg' } }),
		);
	});

	it('compensates uploaded files when the insert fails', async () => {
		vi.mocked(BlogModel.findOne).mockResolvedValue(null);
		vi.mocked(BlogModel.create).mockRejectedValue(new Error('db down'));
		vi.mocked(deleteEntityFiles).mockResolvedValue(undefined);
		vi.mocked(uploadImageSafe).mockResolvedValueOnce({
			url: 'https://cdn/cover.jpg',
			storageId: 'cover-1',
		});

		await expect(
			createBlogPost(validInput, { cover: incomingFile('cover') }, 'user-1'),
		).rejects.toThrow('db down');

		expect(deleteEntityFiles).toHaveBeenCalledWith('blog', 'uuid-1');
	});
});
