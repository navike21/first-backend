import { Storage } from '@google-cloud/storage';
import { ENV } from '@Constants/environments';
import type { StorageDriver, StorageFile } from '../../domain/StorageDriver';

export class GCSDriver implements StorageDriver {
	private storage: Storage;
	private bucket: string;
	private baseUrl: string;

	constructor() {
		this.bucket = ENV.GCS_BUCKET!;
		this.baseUrl = `https://storage.googleapis.com/${this.bucket}`;

		const credentials = ENV.GCS_CREDENTIALS
			? (JSON.parse(
					Buffer.from(ENV.GCS_CREDENTIALS, 'base64').toString('utf8'),
				) as object)
			: undefined;

		this.storage = new Storage({ credentials });
	}

	async uploadBuffer(
		buffer: Buffer,
		pathname: string,
		contentType: string,
	): Promise<StorageFile> {
		await this.storage
			.bucket(this.bucket)
			.file(pathname)
			.save(buffer, { contentType, resumable: false });

		return { pathname, url: `${this.baseUrl}/${pathname}` };
	}

	async delete(url: string): Promise<void> {
		const key = url.startsWith(`${this.baseUrl}/`)
			? url.slice(`${this.baseUrl}/`.length)
			: url;
		await this.storage.bucket(this.bucket).file(key).delete();
	}
}
