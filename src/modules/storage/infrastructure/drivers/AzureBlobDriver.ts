import { BlobServiceClient } from '@azure/storage-blob';
import { ENV } from '@Constants/environments';
import type { StorageDriver, StorageFile } from '../../domain/StorageDriver';

export class AzureBlobDriver implements StorageDriver {
	private serviceClient: BlobServiceClient;
	private container: string;

	constructor() {
		this.container = ENV.AZURE_STORAGE_CONTAINER!;
		this.serviceClient = BlobServiceClient.fromConnectionString(
			ENV.AZURE_STORAGE_CONNECTION_STRING!,
		);
	}

	async uploadBuffer(
		buffer: Buffer,
		pathname: string,
		contentType: string,
	): Promise<StorageFile> {
		const blobClient = this.serviceClient
			.getContainerClient(this.container)
			.getBlockBlobClient(pathname);

		await blobClient.uploadData(buffer, {
			blobHTTPHeaders: { blobContentType: contentType },
		});

		return { pathname, url: blobClient.url };
	}

	async delete(url: string): Promise<void> {
		const blobName = url.split(`/${this.container}/`)[1] ?? url;
		await this.serviceClient
			.getContainerClient(this.container)
			.getBlockBlobClient(blobName)
			.delete();
	}

	supportsDirectUpload(): boolean {
		return false;
	}
}
