import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AppError } from '@Shared/domain/AppError';

const mockUploadBuffer = vi.fn();
const mockDriver = { uploadBuffer: mockUploadBuffer };

vi.mock('@Modules/storage/infrastructure/StorageService', () => ({
	getStorageDriver: vi.fn(() => mockDriver),
}));

vi.mock('@Modules/storage/infrastructure/ImageProcessor', () => ({
	processRasterImage: vi.fn(),
}));

vi.mock('@Helpers/uuid', () => ({ default: vi.fn(() => 'test-uuid') }));

const mockFindOne = vi.fn();
const mockFindOneAndUpdate = vi.fn();

vi.mock('@Modules/storage/infrastructure/StorageFileModel', () => ({
	default: {
		findOne: (...args: unknown[]) => mockFindOne(...args),
		findOneAndUpdate: (...args: unknown[]) => mockFindOneAndUpdate(...args),
	},
}));

import { attachVideoCover } from '../attachVideoCover';
import { processRasterImage } from '@Modules/storage/infrastructure/ImageProcessor';

const makeStorageFile = (suffix: string) => ({
	pathname: `path/${suffix}`,
	url: `https://cdn.example.com/${suffix}`,
});

const existingVideoRecord = {
	id: 'video-1',
	entityType: 'editor',
	entityId: 'entity-1',
	isImage: false,
	original: makeStorageFile('original.mp4'),
};

const baseFile = {
	buffer: Buffer.from('cover'),
	originalName: 'cover.jpg',
	mimeType: 'image/jpeg',
};

describe('attachVideoCover', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockFindOne.mockReturnValue({
			lean: vi.fn().mockResolvedValue(existingVideoRecord),
		});
		mockFindOneAndUpdate.mockReturnValue({
			lean: vi.fn().mockResolvedValue({
				...existingVideoRecord,
				full: makeStorageFile('full.webp'),
				thumb: makeStorageFile('thumb.webp'),
			}),
		});
		vi.mocked(processRasterImage).mockResolvedValue({
			full: Buffer.from('full'),
			thumb: Buffer.from('thumb'),
		});
		mockUploadBuffer
			.mockResolvedValueOnce(makeStorageFile('full.webp'))
			.mockResolvedValueOnce(makeStorageFile('thumb.webp'));
	});

	it('rejects when no file is provided', async () => {
		await expect(attachVideoCover('video-1', undefined)).rejects.toBeInstanceOf(
			AppError,
		);
		expect(mockFindOne).not.toHaveBeenCalled();
	});

	it('rejects with 404 when the video record does not exist', async () => {
		mockFindOne.mockReturnValue({ lean: vi.fn().mockResolvedValue(null) });

		await expect(
			attachVideoCover('missing-id', baseFile),
		).rejects.toBeInstanceOf(AppError);
		expect(processRasterImage).not.toHaveBeenCalled();
	});

	it('processes the cover through the raster image pipeline and updates the record', async () => {
		const result = await attachVideoCover('video-1', baseFile);

		expect(processRasterImage).toHaveBeenCalledWith(baseFile.buffer, 80);
		expect(mockUploadBuffer).toHaveBeenCalledTimes(2);
		expect(mockUploadBuffer).toHaveBeenCalledWith(
			expect.any(Buffer),
			expect.stringContaining('editor/entity-1/'),
			'image/webp',
		);
		expect(mockFindOneAndUpdate).toHaveBeenCalledWith(
			{ id: 'video-1' },
			{ $set: { full: expect.any(Object), thumb: expect.any(Object) } },
			{ new: true },
		);
		expect(result.full).toBeDefined();
		expect(result.thumb).toBeDefined();
	});
});
