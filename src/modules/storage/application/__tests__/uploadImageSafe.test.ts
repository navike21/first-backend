import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@Modules/storage/application/uploadFile', () => ({
	uploadFile: vi.fn(),
}));
vi.mock('@Helpers/log', () => ({ logError: vi.fn() }));

import { uploadImageSafe } from '@Modules/storage/application/uploadImageSafe';
import { uploadFile } from '@Modules/storage/application/uploadFile';
import { logError } from '@Helpers/log';

const baseInput = {
	buffer: Buffer.from('img'),
	originalName: 'logo.png',
	mimeType: 'image/png',
	entityType: 'clients',
	entityId: 'client-1',
};

describe('uploadImageSafe', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('returns the processed full url and storageId on success', async () => {
		vi.mocked(uploadFile).mockResolvedValue({
			id: 'storage-1',
			original: { url: 'https://cdn/o.png' },
			full: { url: 'https://cdn/full.webp' },
		} as never);

		const result = await uploadImageSafe(baseInput);

		expect(result.url).toBe('https://cdn/full.webp');
		expect(result.storageId).toBe('storage-1');
		expect(result.warning).toBeUndefined();
	});

	it('falls back to the original url when there is no full variant', async () => {
		vi.mocked(uploadFile).mockResolvedValue({
			id: 'storage-2',
			original: { url: 'https://cdn/o.svg' },
		} as never);

		const result = await uploadImageSafe({
			...baseInput,
			mimeType: 'image/svg+xml',
		});

		expect(result.url).toBe('https://cdn/o.svg');
		expect(result.storageId).toBe('storage-2');
	});

	it('never throws and returns a non-blocking warning when upload fails', async () => {
		vi.mocked(uploadFile).mockRejectedValue(new Error('driver down'));

		const result = await uploadImageSafe(baseInput);

		expect(result.url).toBeUndefined();
		expect(result.storageId).toBeUndefined();
		expect(result.warning).toEqual({
			field: 'image',
			code: 'IMAGE_UPLOAD_FAILED',
			message: expect.any(String),
		});
		expect(logError).toHaveBeenCalled();
	});

	it('echoes the provided field name in the warning', async () => {
		vi.mocked(uploadFile).mockRejectedValue(new Error('boom'));

		const result = await uploadImageSafe({ ...baseInput, field: 'logo' });

		expect(result.warning?.field).toBe('logo');
	});
});
