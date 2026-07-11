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
	/** Whether this driver can issue direct browser-to-storage upload tokens
	 * (bypassing the Express body, needed for files too large for a
	 * serverless function's request body — e.g. video). Only implemented for
	 * vercel-blob today; other drivers report false rather than pretending to
	 * support an untested/unbuilt code path. */
	supportsDirectUpload(): boolean;
}
