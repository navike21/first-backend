import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/portfolio/infrastructure/PortfolioModel', () => ({
	default: { findOne: vi.fn(), create: vi.fn() },
}));
vi.mock('@Helpers/generateSlug', () => ({
	generateSlug: vi.fn().mockReturnValue('project-name'),
}));
vi.mock('@Modules/storage', () => ({
	uploadImageSafe: vi.fn(),
	deleteEntityFiles: vi.fn(),
}));
vi.mock('@Helpers/uuid', () => ({ default: vi.fn().mockReturnValue('uuid-1') }));

import { createPortfolio } from '@Modules/portfolio/application/createPortfolio';
import PortfolioModel from '@Modules/portfolio/infrastructure/PortfolioModel';
import { PortfolioSlugConflictError } from '@Modules/portfolio/domain/errors/PortfolioErrors';
import { uploadImageSafe, deleteEntityFiles } from '@Modules/storage';

const galleryFile = (name: string) => ({
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
	name: ls,
	shortDescription: ls,
	description: ls,
	coverImageUrl: 'https://example.com/cover.jpg',
	serviceIds: ['550e8400-e29b-41d4-a716-446655440000'],
	startDate: '2024-01-01',
	gallery: [],
	technologies: [],
	metrics: [],
	featured: false,
	order: 0,
	status: 'draft' as const,
};

describe('createPortfolio', () => {
	it('creates portfolio and returns cleaned data', async () => {
		vi.mocked(PortfolioModel.findOne).mockResolvedValue(null);
		vi.mocked(PortfolioModel.create).mockResolvedValue({
			...validInput,
			id: 'uuid-1',
			slug: 'project-name',
			toObject: vi
				.fn()
				.mockReturnValue({ ...validInput, id: 'uuid-1', _id: 'mongo-1' }),
		} as never);

		const result = await createPortfolio(validInput);

		expect(PortfolioModel.create).toHaveBeenCalled();
		expect(result.data).not.toHaveProperty('_id');
		expect(result.warnings).toEqual([]);
	});

	it('throws PortfolioSlugConflictError when slug exists', async () => {
		vi.mocked(PortfolioModel.findOne).mockResolvedValue({
			id: 'existing',
		} as never);

		await expect(createPortfolio(validInput)).rejects.toThrow(
			PortfolioSlugConflictError,
		);
	});

	it('throws when no cover image is provided (no file, no url)', async () => {
		vi.mocked(PortfolioModel.findOne).mockResolvedValue(null);
		const { coverImageUrl: _cover, ...withoutCover } = validInput;

		await expect(
			createPortfolio(withoutCover as typeof validInput),
		).rejects.toMatchObject({ code: 'PORTFOLIO_COVER_REQUIRED' });
		expect(PortfolioModel.create).not.toHaveBeenCalled();
	});

	it('uploads gallery files and stores their urls in arrival order', async () => {
		vi.mocked(PortfolioModel.findOne).mockResolvedValue(null);
		vi.mocked(uploadImageSafe)
			.mockResolvedValueOnce({ url: 'https://cdn/gal-1.jpg', storageId: 'g1' })
			.mockResolvedValueOnce({ url: 'https://cdn/gal-2.jpg', storageId: 'g2' });
		vi.mocked(PortfolioModel.create).mockResolvedValue({
			toObject: vi.fn().mockReturnValue({ id: 'uuid-1', _id: 'mongo-1' }),
		} as never);

		await createPortfolio(
			validInput,
			undefined,
			'user-1',
			[galleryFile('a'), galleryFile('b')],
		);

		expect(uploadImageSafe).toHaveBeenCalledTimes(2);
		expect(uploadImageSafe).toHaveBeenCalledWith(
			expect.objectContaining({ field: 'gallery', uploadedBy: 'user-1' }),
		);
		expect(PortfolioModel.create).toHaveBeenCalledWith(
			expect.objectContaining({
				gallery: ['https://cdn/gal-1.jpg', 'https://cdn/gal-2.jpg'],
			}),
		);
	});

	it('collects a warning and skips the url for a gallery file that fails to upload', async () => {
		vi.mocked(PortfolioModel.findOne).mockResolvedValue(null);
		vi.mocked(uploadImageSafe).mockResolvedValueOnce({
			warning: { field: 'gallery', code: 'IMAGE_UPLOAD_FAILED', message: 'failed' },
		});
		vi.mocked(PortfolioModel.create).mockResolvedValue({
			toObject: vi.fn().mockReturnValue({ id: 'uuid-1', _id: 'mongo-1' }),
		} as never);

		const result = await createPortfolio(validInput, undefined, 'user-1', [
			galleryFile('a'),
		]);

		expect(PortfolioModel.create).toHaveBeenCalledWith(
			expect.objectContaining({ gallery: [] }),
		);
		expect(result.warnings).toEqual([
			{ field: 'gallery', code: 'IMAGE_UPLOAD_FAILED', message: 'failed' },
		]);
	});

	it('compensates uploaded gallery files when the insert fails', async () => {
		vi.mocked(PortfolioModel.findOne).mockResolvedValue(null);
		vi.mocked(uploadImageSafe).mockResolvedValueOnce({
			url: 'https://cdn/gal-1.jpg',
			storageId: 'g1',
		});
		vi.mocked(PortfolioModel.create).mockRejectedValue(new Error('db down'));
		vi.mocked(deleteEntityFiles).mockResolvedValue(undefined);

		await expect(
			createPortfolio(validInput, undefined, 'user-1', [galleryFile('a')]),
		).rejects.toThrow('db down');

		expect(deleteEntityFiles).toHaveBeenCalledWith('portfolio', 'uuid-1');
	});
});
