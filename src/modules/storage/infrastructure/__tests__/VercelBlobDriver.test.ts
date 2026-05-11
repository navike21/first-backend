import { describe, it, expect, vi, beforeEach } from 'vitest';
import { VercelBlobDriver } from '../drivers/VercelBlobDriver';

vi.mock('@vercel/blob', () => ({
	put: vi.fn(),
	del: vi.fn(),
}));

vi.mock('@Constants/environments', () => ({
	ENV: {
		BLOB_READ_WRITE_TOKEN: 'test-token',
	},
}));

const { put, del } = await import('@vercel/blob');

describe('VercelBlobDriver', () => {
	let driver: VercelBlobDriver;

	beforeEach(() => {
		driver = new VercelBlobDriver();
		vi.clearAllMocks();
	});

	describe('uploadBuffer', () => {
		it('calls put with the right arguments and returns pathname and url', async () => {
			vi.mocked(put).mockResolvedValue({
				pathname: 'users/123/original.jpg',
				url: 'https://blob.vercel-storage.com/users/123/original.jpg',
				downloadUrl: '',
				contentDisposition: '',
			} as Awaited<ReturnType<typeof put>>);

			const result = await driver.uploadBuffer(
				Buffer.from('data'),
				'users/123/original.jpg',
				'image/jpeg',
			);

			expect(put).toHaveBeenCalledWith('users/123/original.jpg', expect.any(Buffer), {
				access: 'public',
				contentType: 'image/jpeg',
				token: 'test-token',
			});
			expect(result.pathname).toBe('users/123/original.jpg');
			expect(result.url).toBe(
				'https://blob.vercel-storage.com/users/123/original.jpg',
			);
		});

		it('propagates errors from put', async () => {
			vi.mocked(put).mockRejectedValue(new Error('network error'));

			await expect(
				driver.uploadBuffer(Buffer.from('data'), 'path', 'image/jpeg'),
			).rejects.toThrow('network error');
		});
	});

	describe('delete', () => {
		it('calls del with the url and token', async () => {
			vi.mocked(del).mockResolvedValue(undefined);
			const url = 'https://blob.vercel-storage.com/users/123/original.jpg';

			await driver.delete(url);

			expect(del).toHaveBeenCalledWith(url, { token: 'test-token' });
		});

		it('propagates errors from del', async () => {
			vi.mocked(del).mockRejectedValue(new Error('delete failed'));

			await expect(
				driver.delete('https://example.com/file.jpg'),
			).rejects.toThrow('delete failed');
		});
	});
});
