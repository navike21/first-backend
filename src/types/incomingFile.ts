/**
 * A file handed to an application use-case, decoupled from Express/Multer types.
 * Controllers map `req.file` into this via `getUploadedFile`.
 */
export interface IncomingFile {
	buffer: Buffer;
	originalName: string;
	mimeType: string;
}
