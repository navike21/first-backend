import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockSave, mockDelete } = vi.hoisted(() => ({
	mockSave: vi.fn(),
	mockDelete: vi.fn(),
}));

vi.mock('@google-cloud/storage', () => ({
	Storage: class {
		bucket(_name: string) {
			return {
				file: (_path: string) => ({
					save: mockSave,
					delete: mockDelete,
				}),
			};
		}
	},
}));

vi.mock('@Constants/environments', () => ({
	ENV: {
		GCS_BUCKET: 'test-bucket',
		GCS_CREDENTIALS: undefined,
	},
}));

import { GCSDriver } from '../drivers/GCSDriver';

describe('GCSDriver', () => {
	let driver: GCSDriver;

	beforeEach(() => {
		vi.clearAllMocks();
		driver = new GCSDriver();
	});

	it('uploadBuffer saves buffer and returns pathname and url', async () => {
		mockSave.mockResolvedValue(undefined);

		const result = await driver.uploadBuffer(
			Buffer.from('data'),
			'uploads/file.jpg',
			'image/jpeg',
		);

		expect(mockSave).toHaveBeenCalledWith(expect.any(Buffer), {
			contentType: 'image/jpeg',
			resumable: false,
		});
		expect(result.pathname).toBe('uploads/file.jpg');
		expect(result.url).toContain('test-bucket');
		expect(result.url).toContain('uploads/file.jpg');
	});

	it('delete extracts key from base url and deletes', async () => {
		mockDelete.mockResolvedValue(undefined);
		const baseUrl = 'https://storage.googleapis.com/test-bucket';

		await driver.delete(`${baseUrl}/uploads/file.jpg`);

		expect(mockDelete).toHaveBeenCalled();
	});

	it('delete uses full url as key when not matching base', async () => {
		mockDelete.mockResolvedValue(undefined);

		await driver.delete('https://other.com/file.jpg');

		expect(mockDelete).toHaveBeenCalled();
	});

	it('propagates upload errors', async () => {
		mockSave.mockRejectedValue(new Error('gcs error'));

		await expect(
			driver.uploadBuffer(Buffer.from('data'), 'path', 'image/jpeg'),
		).rejects.toThrow('gcs error');
	});

	it('supportsDirectUpload returns false (not implemented for this driver)', () => {
		expect(driver.supportsDirectUpload()).toBe(false);
	});
});
