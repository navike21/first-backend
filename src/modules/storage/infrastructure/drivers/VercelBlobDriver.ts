import { put, del } from '@vercel/blob';
import { ENV } from '@Constants/environments';
import type { StorageDriver, StorageFile } from '../../domain/StorageDriver';

export class VercelBlobDriver implements StorageDriver {
	async uploadBuffer(
		buffer: Buffer,
		pathname: string,
		contentType: string,
	): Promise<StorageFile> {
		const blob = await put(pathname, buffer, {
			access: 'public',
			contentType,
			token: ENV.BLOB_READ_WRITE_TOKEN,
		});
		return { pathname: blob.pathname, url: blob.url };
	}

	async delete(url: string): Promise<void> {
		await del(url, { token: ENV.BLOB_READ_WRITE_TOKEN });
	}

	supportsDirectUpload(): boolean {
		return true;
	}
}
