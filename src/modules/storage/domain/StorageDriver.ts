export interface StorageFile {
	pathname: string;
	url: string;
}

export interface UploadResult {
	original: StorageFile;
	full?: StorageFile;
	thumb?: StorageFile;
	mimeType: string;
	size: number;
	isImage: boolean;
}

export interface StorageDriver {
	uploadBuffer(
		buffer: Buffer,
		pathname: string,
		contentType: string,
	): Promise<StorageFile>;
	delete(url: string): Promise<void>;
}
