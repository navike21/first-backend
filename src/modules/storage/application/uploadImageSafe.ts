import { logError } from '@Helpers/log';
import type { ResponseWarning } from '@Types/responseStructure';
import { uploadFile, type UploadInput } from './uploadFile';

export interface UploadImageSafeInput extends UploadInput {
	/** Form field name, echoed back in the warning so the client knows what failed. */
	field?: string;
}

export interface UploadImageSafeResult {
	/** Display URL (processed `full` variant for raster, original otherwise). */
	url?: string;
	/** StorageFile id, useful as a lifecycle reference. */
	storageId?: string;
	/** Present only when the upload failed; the caller proceeds non-blocking. */
	warning?: ResponseWarning;
}

/**
 * Uploads an image without ever throwing. On success returns the display URL;
 * on failure returns a non-blocking warning so the surrounding create/update
 * can still persist the record (partial success).
 */
export async function uploadImageSafe(
	input: UploadImageSafeInput,
): Promise<UploadImageSafeResult> {
	const field = input.field ?? 'image';
	try {
		const record = await uploadFile(input);
		const url = record.full?.url ?? record.original.url;
		return { url, storageId: record.id };
	} catch (error) {
		logError(
			`[uploadImageSafe] Upload failed for ${input.entityType}/${input.entityId}: ${error}`,
		);
		return {
			warning: {
				field,
				code: 'IMAGE_UPLOAD_FAILED',
				message: 'The record was saved, but the image could not be uploaded',
			},
		};
	}
}
