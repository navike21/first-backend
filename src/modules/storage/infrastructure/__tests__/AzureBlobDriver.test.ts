import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockUploadData = vi.fn();
const mockDeleteBlob = vi.fn();
const mockGetBlockBlobClient = vi.fn(() => ({
	uploadData: mockUploadData,
	delete: mockDeleteBlob,
	url: 'https://account.blob.core.windows.net/container/test.jpg',
}));
const mockGetContainerClient = vi.fn(() => ({
	getBlockBlobClient: mockGetBlockBlobClient,
}));

vi.mock('@azure/storage-blob', () => ({
	BlobServiceClient: {
		fromConnectionString: vi.fn(() => ({
			getContainerClient: mockGetContainerClient,
		})),
	},
}));

vi.mock('@Constants/environments', () => ({
	ENV: {
		AZURE_STORAGE_CONTAINER: 'test-container',
		AZURE_STORAGE_CONNECTION_STRING: 'DefaultEndpointsProtocol=https;...',
	},
}));

import { AzureBlobDriver } from '../drivers/AzureBlobDriver';

describe('AzureBlobDriver', () => {
	let driver: AzureBlobDriver;

	beforeEach(() => {
		driver = new AzureBlobDriver();
		vi.clearAllMocks();
	});

	it('uploadBuffer calls uploadData and returns pathname and url', async () => {
		mockUploadData.mockResolvedValue(undefined);

		const result = await driver.uploadBuffer(
			Buffer.from('data'),
			'uploads/file.jpg',
			'image/jpeg',
		);

		expect(mockUploadData).toHaveBeenCalledWith(expect.any(Buffer), {
			blobHTTPHeaders: { blobContentType: 'image/jpeg' },
		});
		expect(result.pathname).toBe('uploads/file.jpg');
		expect(result.url).toBeDefined();
	});

	it('delete extracts blob name and calls delete', async () => {
		mockDeleteBlob.mockResolvedValue(undefined);
		const url =
			'https://account.blob.core.windows.net/test-container/uploads/file.jpg';

		await driver.delete(url);

		expect(mockGetBlockBlobClient).toHaveBeenCalledWith('uploads/file.jpg');
		expect(mockDeleteBlob).toHaveBeenCalled();
	});

	it('delete falls back to full url as blob name when container not found in url', async () => {
		mockDeleteBlob.mockResolvedValue(undefined);

		await driver.delete('https://other.com/file.jpg');

		expect(mockDeleteBlob).toHaveBeenCalled();
	});

	it('propagates upload errors', async () => {
		mockUploadData.mockRejectedValue(new Error('azure error'));

		await expect(
			driver.uploadBuffer(Buffer.from('data'), 'path', 'image/jpeg'),
		).rejects.toThrow('azure error');
	});

	it('supportsDirectUpload returns false (not implemented for this driver)', () => {
		expect(driver.supportsDirectUpload()).toBe(false);
	});
});
