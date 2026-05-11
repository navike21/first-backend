import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AppError } from '@Shared/domain/AppError';

const mockUploadBuffer = vi.fn();
const mockDelete = vi.fn();
const mockDriver = { uploadBuffer: mockUploadBuffer, delete: mockDelete };

vi.mock('@Modules/storage/infrastructure/StorageService', () => ({
	getStorageDriver: vi.fn(() => mockDriver),
}));

vi.mock('@Modules/storage/infrastructure/ImageProcessor', () => ({
	processRasterImage: vi.fn(),
}));

vi.mock('@Helpers/uuid', () => ({ default: vi.fn(() => 'test-uuid') }));

import { uploadFile } from '../uploadFile';
import { processRasterImage } from '@Modules/storage/infrastructure/ImageProcessor';

const makeStorageFile = (suffix: string) => ({
	pathname: `path/${suffix}`,
	url: `https://cdn.example.com/${suffix}`,
});

describe('uploadFile', () => {
	const baseInput = {
		buffer: Buffer.from('img'),
		originalName: 'photo.jpg',
		mimeType: 'image/jpeg',
		entityType: 'users',
		entityId: 'entity-1',
		quality: 80,
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('raster image (jpeg)', () => {
		it('uploads original, full and thumb variants', async () => {
			const fullBuf = Buffer.from('full');
			const thumbBuf = Buffer.from('thumb');
			vi.mocked(processRasterImage).mockResolvedValue({
				full: fullBuf,
				thumb: thumbBuf,
			});
			mockUploadBuffer
				.mockResolvedValueOnce(makeStorageFile('original.jpg'))
				.mockResolvedValueOnce(makeStorageFile('full.webp'))
				.mockResolvedValueOnce(makeStorageFile('thumb.webp'));

			const result = await uploadFile(baseInput);

			expect(mockUploadBuffer).toHaveBeenCalledTimes(3);
			expect(result.original).toBeDefined();
			expect(result.full).toBeDefined();
			expect(result.thumb).toBeDefined();
			expect(result.isImage).toBe(true);
			expect(result.mimeType).toBe('image/jpeg');
			expect(result.size).toBe(baseInput.buffer.length);
		});

		it('uses default quality 80 when quality is not provided', async () => {
			vi.mocked(processRasterImage).mockResolvedValue({
				full: Buffer.from('f'),
				thumb: Buffer.from('t'),
			});
			mockUploadBuffer.mockResolvedValue(makeStorageFile('any'));

			const { quality: _, ...inputWithoutQuality } = baseInput;
			await uploadFile(inputWithoutQuality);

			expect(processRasterImage).toHaveBeenCalledWith(expect.any(Buffer), 80);
		});

		it('passes provided quality to processRasterImage', async () => {
			vi.mocked(processRasterImage).mockResolvedValue({
				full: Buffer.from('f'),
				thumb: Buffer.from('t'),
			});
			mockUploadBuffer.mockResolvedValue(makeStorageFile('any'));

			await uploadFile({ ...baseInput, quality: 90 });

			expect(processRasterImage).toHaveBeenCalledWith(expect.any(Buffer), 90);
		});
	});

	describe('SVG image', () => {
		it('uploads only original, isImage is true, no variants', async () => {
			mockUploadBuffer.mockResolvedValue(makeStorageFile('original.svg'));

			const result = await uploadFile({
				...baseInput,
				mimeType: 'image/svg+xml',
				originalName: 'icon.svg',
			});

			expect(mockUploadBuffer).toHaveBeenCalledTimes(1);
			expect(result.original).toBeDefined();
			expect(result.full).toBeUndefined();
			expect(result.thumb).toBeUndefined();
			expect(result.isImage).toBe(true);
		});
	});

	describe('document (PDF)', () => {
		it('uploads only original, isImage is false', async () => {
			mockUploadBuffer.mockResolvedValue(makeStorageFile('original.pdf'));

			const result = await uploadFile({
				...baseInput,
				mimeType: 'application/pdf',
				originalName: 'doc.pdf',
			});

			expect(mockUploadBuffer).toHaveBeenCalledTimes(1);
			expect(result.full).toBeUndefined();
			expect(result.thumb).toBeUndefined();
			expect(result.isImage).toBe(false);
		});

		it('uses bin extension for unknown mime types', async () => {
			mockUploadBuffer.mockResolvedValue(makeStorageFile('original.bin'));

			await uploadFile({ ...baseInput, mimeType: 'application/octet-stream' });

			expect(mockUploadBuffer).toHaveBeenCalledWith(
				expect.any(Buffer),
				expect.stringContaining('original.bin'),
				'application/octet-stream',
			);
		});
	});

	it('propagates driver errors', async () => {
		mockUploadBuffer.mockRejectedValue(new AppError({
			statusCode: 500,
			code: 'UPLOAD_FAILED',
			message: 'Upload failed',
		}));

		await expect(uploadFile(baseInput)).rejects.toBeInstanceOf(AppError);
	});
});
