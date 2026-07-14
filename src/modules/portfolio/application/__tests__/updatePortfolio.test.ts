import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/portfolio/infrastructure/PortfolioModel', () => ({
	default: { findOne: vi.fn() },
}));
vi.mock('@Modules/storage', () => ({
	uploadImageSafe: vi.fn(),
	deleteEntityFiles: vi.fn(),
	deleteStorageFilesByIds: vi.fn(),
	listEntityFiles: vi.fn(),
}));

import { updatePortfolio } from '@Modules/portfolio/application/updatePortfolio';
import PortfolioModel from '@Modules/portfolio/infrastructure/PortfolioModel';
import {
	PortfolioNotFoundError,
	PortfolioSlugConflictError,
} from '@Modules/portfolio/domain/errors/PortfolioErrors';
import {
	uploadImageSafe,
	deleteEntityFiles,
	deleteStorageFilesByIds,
	listEntityFiles,
} from '@Modules/storage';

const galleryFile = (name: string) => ({
	buffer: Buffer.from(name),
	originalName: `${name}.jpg`,
	mimeType: 'image/jpeg',
});

describe('updatePortfolio', () => {
	beforeEach(() => {
		vi.mocked(deleteEntityFiles).mockResolvedValue(undefined);
		vi.mocked(deleteStorageFilesByIds).mockResolvedValue(undefined);
	});

	it('updates and returns portfolio', async () => {
		const saveFn = vi.fn().mockResolvedValue(undefined);
		const portfolioDoc = {
			id: '1',
			status: 'draft',
			save: saveFn,
			toObject: vi
				.fn()
				.mockReturnValue({ id: '1', status: 'published', _id: 'm1' }),
		};
		vi.mocked(PortfolioModel.findOne).mockResolvedValue(portfolioDoc as never);

		const result = await updatePortfolio('1', { status: 'published' });

		expect(saveFn).toHaveBeenCalled();
		expect(result.data).not.toHaveProperty('_id');
	});

	it('throws PortfolioNotFoundError when not found', async () => {
		vi.mocked(PortfolioModel.findOne).mockResolvedValue(null as never);

		await expect(updatePortfolio('not-found', {})).rejects.toThrow(
			PortfolioNotFoundError,
		);
	});

	it('throws PortfolioSlugConflictError on duplicate slug', async () => {
		const portfolioDoc = { id: '1', save: vi.fn() };
		const conflict = { id: '2', slug: 'taken' };
		vi.mocked(PortfolioModel.findOne)
			.mockResolvedValueOnce(portfolioDoc as never)
			.mockResolvedValueOnce(conflict as never);

		await expect(updatePortfolio('1', { slug: 'taken' })).rejects.toThrow(
			PortfolioSlugConflictError,
		);
	});

	it('leaves the gallery untouched when galleryOrder is omitted', async () => {
		const saveFn = vi.fn().mockResolvedValue(undefined);
		const portfolioDoc = {
			id: '1',
			gallery: ['https://cdn/old.jpg'],
			save: saveFn,
			toObject: vi.fn().mockReturnValue({ id: '1', _id: 'm1' }),
		};
		vi.mocked(PortfolioModel.findOne).mockResolvedValue(portfolioDoc as never);

		await updatePortfolio('1', { status: 'published' });

		expect(portfolioDoc.gallery).toEqual(['https://cdn/old.jpg']);
		expect(uploadImageSafe).not.toHaveBeenCalled();
		expect(listEntityFiles).not.toHaveBeenCalled();
	});

	it('reconciles galleryOrder: keeps existing urls, uploads new files, interleaved', async () => {
		const saveFn = vi.fn().mockResolvedValue(undefined);
		const portfolioDoc: {
			id: string;
			gallery: string[];
			save: typeof saveFn;
			toObject: () => unknown;
		} = {
			id: '1',
			gallery: ['https://cdn/a.jpg', 'https://cdn/b.jpg'],
			save: saveFn,
			toObject: vi.fn().mockReturnValue({ id: '1', _id: 'm1' }),
		};
		vi.mocked(PortfolioModel.findOne).mockResolvedValue(portfolioDoc as never);
		vi.mocked(uploadImageSafe).mockResolvedValueOnce({
			url: 'https://cdn/new.jpg',
			storageId: 'new-1',
		});
		vi.mocked(listEntityFiles).mockResolvedValue([
			{ id: 's-a', original: { url: 'https://cdn/a.jpg' } },
			{ id: 's-b', original: { url: 'https://cdn/b.jpg' } },
			{ id: 'new-1', original: { url: 'https://cdn/new.jpg' } },
		] as never);

		await updatePortfolio(
			'1',
			{
				galleryOrder: [
					{ type: 'existing', url: 'https://cdn/a.jpg' },
					{ type: 'new', index: 0 },
					{ type: 'existing', url: 'https://cdn/b.jpg' },
				],
			},
			undefined,
			'user-1',
			[galleryFile('new')],
		);

		expect(portfolioDoc.gallery).toEqual([
			'https://cdn/a.jpg',
			'https://cdn/new.jpg',
			'https://cdn/b.jpg',
		]);
		expect(deleteStorageFilesByIds).not.toHaveBeenCalled();
	});

	it('deletes gallery files that were dropped from galleryOrder', async () => {
		const saveFn = vi.fn().mockResolvedValue(undefined);
		const portfolioDoc = {
			id: '1',
			gallery: ['https://cdn/a.jpg', 'https://cdn/b.jpg'],
			save: saveFn,
			toObject: vi.fn().mockReturnValue({ id: '1', _id: 'm1' }),
		};
		vi.mocked(PortfolioModel.findOne).mockResolvedValue(portfolioDoc as never);
		vi.mocked(listEntityFiles).mockResolvedValue([
			{ id: 's-a', original: { url: 'https://cdn/a.jpg' } },
			{ id: 's-b', original: { url: 'https://cdn/b.jpg' } },
		] as never);

		await updatePortfolio('1', {
			galleryOrder: [{ type: 'existing', url: 'https://cdn/a.jpg' }],
		});

		expect(portfolioDoc.gallery).toEqual(['https://cdn/a.jpg']);
		expect(deleteStorageFilesByIds).toHaveBeenCalledWith(['s-b']);
	});

	it('scopes the old cover cleanup to field:cover, leaving the gallery alone', async () => {
		const saveFn = vi.fn().mockResolvedValue(undefined);
		const portfolioDoc = {
			id: '1',
			gallery: ['https://cdn/a.jpg'],
			save: saveFn,
			toObject: vi.fn().mockReturnValue({ id: '1', _id: 'm1' }),
		};
		vi.mocked(PortfolioModel.findOne).mockResolvedValue(portfolioDoc as never);
		vi.mocked(uploadImageSafe).mockResolvedValueOnce({
			url: 'https://cdn/new-cover.jpg',
			storageId: 'cover-new',
		});

		await updatePortfolio(
			'1',
			{},
			{
				buffer: Buffer.from('c'),
				originalName: 'c.jpg',
				mimeType: 'image/jpeg',
			},
			'user-1',
		);

		expect(deleteEntityFiles).toHaveBeenCalledWith('portfolio', '1', {
			field: 'cover',
			exceptStorageIds: ['cover-new'],
		});
	});

	it('compensates newly uploaded gallery files when save fails', async () => {
		const portfolioDoc = {
			id: '1',
			gallery: [] as string[],
			save: vi.fn().mockRejectedValue(new Error('db down')),
			toObject: vi.fn(),
		};
		vi.mocked(PortfolioModel.findOne).mockResolvedValue(portfolioDoc as never);
		vi.mocked(uploadImageSafe).mockResolvedValueOnce({
			url: 'https://cdn/new.jpg',
			storageId: 'new-1',
		});

		await expect(
			updatePortfolio(
				'1',
				{ galleryOrder: [{ type: 'new', index: 0 }] },
				undefined,
				'user-1',
				[galleryFile('new')],
			),
		).rejects.toThrow('db down');

		expect(deleteStorageFilesByIds).toHaveBeenCalledWith(['new-1']);
	});
});
