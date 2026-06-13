import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { STORAGE_MAX_IMAGE_SIZE_BYTES: 4 * 1024 * 1024 },
}));
vi.mock('@Modules/storage/middlewares/multerUpload', () => ({
	createMulterSingle: vi.fn(() => 'multer-handler'),
}));
vi.mock('@Modules/storage/middlewares/validateFileType', () => ({
	validateFileType: vi.fn(() => 'validate-handler'),
}));

import { acceptImage } from '@Modules/storage/middlewares/acceptImage';
import { createMulterSingle } from '@Modules/storage/middlewares/multerUpload';
import { validateFileType } from '@Modules/storage/middlewares/validateFileType';
import { IMAGE_MIME_TYPES } from '@Modules/storage/constants/allowedMimeTypes';

describe('acceptImage', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('returns [multer, validateFileType] with image defaults (optional)', () => {
		const handlers = acceptImage('logo');

		expect(handlers).toEqual(['multer-handler', 'validate-handler']);
		expect(createMulterSingle).toHaveBeenCalledWith('logo', 4 * 1024 * 1024);
		expect(validateFileType).toHaveBeenCalledWith({
			allowedMimeTypes: IMAGE_MIME_TYPES,
			field: 'file',
			required: false,
		});
	});

	it('honours custom size, mime list and required flag', () => {
		const custom = ['image/png'] as const;
		acceptImage('avatar', {
			maxSizeBytes: 1024,
			allowedMimeTypes: custom,
			required: true,
		});

		expect(createMulterSingle).toHaveBeenCalledWith('avatar', 1024);
		expect(validateFileType).toHaveBeenCalledWith({
			allowedMimeTypes: custom,
			field: 'file',
			required: true,
		});
	});
});
