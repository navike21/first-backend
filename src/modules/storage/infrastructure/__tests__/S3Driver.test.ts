import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockSend } = vi.hoisted(() => ({ mockSend: vi.fn() }));

vi.mock('@aws-sdk/client-s3', () => ({
	S3Client: class {
		send = mockSend;
	},
	PutObjectCommand: class {
		constructor(public params: unknown) {}
	},
	DeleteObjectCommand: class {
		constructor(public params: unknown) {}
	},
}));

vi.mock('@Constants/environments', () => ({
	ENV: {
		AWS_S3_BUCKET: 'test-bucket',
		AWS_REGION: 'us-east-1',
		AWS_ACCESS_KEY_ID: 'key',
		AWS_SECRET_ACCESS_KEY: 'secret',
	},
}));

import { S3Driver } from '../drivers/S3Driver';

describe('S3Driver', () => {
	let driver: S3Driver;

	beforeEach(() => {
		vi.clearAllMocks();
		driver = new S3Driver();
	});

	it('uploadBuffer sends PutObjectCommand and returns pathname and url', async () => {
		mockSend.mockResolvedValue({});

		const result = await driver.uploadBuffer(
			Buffer.from('data'),
			'uploads/file.jpg',
			'image/jpeg',
		);

		expect(mockSend).toHaveBeenCalledTimes(1);
		expect(result.pathname).toBe('uploads/file.jpg');
		expect(result.url).toContain('test-bucket');
		expect(result.url).toContain('uploads/file.jpg');
	});

	it('delete sends DeleteObjectCommand with correct key', async () => {
		mockSend.mockResolvedValue({});
		const baseUrl = 'https://test-bucket.s3.us-east-1.amazonaws.com';

		await driver.delete(`${baseUrl}/uploads/file.jpg`);

		expect(mockSend).toHaveBeenCalledTimes(1);
	});

	it('delete falls back to full url as key when url does not match baseUrl', async () => {
		mockSend.mockResolvedValue({});

		await driver.delete('https://other-cdn.com/file.jpg');

		expect(mockSend).toHaveBeenCalledTimes(1);
	});

	it('propagates uploadBuffer errors', async () => {
		mockSend.mockRejectedValue(new Error('s3 error'));

		await expect(
			driver.uploadBuffer(Buffer.from('data'), 'path', 'image/jpeg'),
		).rejects.toThrow('s3 error');
	});
});
