import {
	S3Client,
	PutObjectCommand,
	DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { ENV } from '@Constants/environments';
import type { StorageDriver, StorageFile } from '../../domain/StorageDriver';

export class S3Driver implements StorageDriver {
	private client: S3Client;
	private bucket: string;
	private baseUrl: string;

	constructor() {
		this.bucket = ENV.AWS_S3_BUCKET!;
		this.client = new S3Client({
			region: ENV.AWS_REGION!,
			credentials: {
				accessKeyId: ENV.AWS_ACCESS_KEY_ID!,
				secretAccessKey: ENV.AWS_SECRET_ACCESS_KEY!,
			},
		});
		this.baseUrl = `https://${this.bucket}.s3.${ENV.AWS_REGION}.amazonaws.com`;
	}

	async uploadBuffer(
		buffer: Buffer,
		pathname: string,
		contentType: string,
	): Promise<StorageFile> {
		await this.client.send(
			new PutObjectCommand({
				Bucket: this.bucket,
				Key: pathname,
				Body: buffer,
				ContentType: contentType,
			}),
		);
		return { pathname, url: `${this.baseUrl}/${pathname}` };
	}

	async delete(url: string): Promise<void> {
		const key = url.startsWith(`${this.baseUrl}/`)
			? url.slice(`${this.baseUrl}/`.length)
			: url;
		await this.client.send(
			new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
		);
	}

	supportsDirectUpload(): boolean {
		return false;
	}
}
