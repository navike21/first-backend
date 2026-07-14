import generateUUID from '@Helpers/uuid';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { AppError } from '@Shared/domain/AppError';
import type { IncomingFile } from '@Types/incomingFile';
import { processRasterImage } from '../infrastructure/ImageProcessor';
import { getStorageDriver } from '../infrastructure/StorageService';
import StorageFileModel from '../infrastructure/StorageFileModel';

const DEFAULT_QUALITY = 80;

/**
 * Attaches a client-generated cover frame (captured from a video, uploaded
 * as a plain image) to an existing StorageFile record — the same full/thumb
 * webp variants a normal image gets, just reusing the video's own record
 * instead of creating a new one.
 */
export async function attachVideoCover(
	id: string,
	file: IncomingFile | undefined,
) {
	if (!file)
		AppError.badRequest('FILE_REQUIRED', 'No cover image was provided');

	const existing = await StorageFileModel.findOne({ id }).lean();
	if (!existing) AppError.notFound('STORAGE_FILE_NOT_FOUND', 'File not found');

	const driver = getStorageDriver();
	const { full: fullBuf, thumb: thumbBuf } = await processRasterImage(
		file.buffer,
		DEFAULT_QUALITY,
	);
	const base = `${existing.entityType}/${existing.entityId}/${generateUUID()}`;
	const [full, thumb] = await Promise.all([
		driver.uploadBuffer(fullBuf, `${base}/full.webp`, 'image/webp'),
		driver.uploadBuffer(thumbBuf, `${base}/thumb.webp`, 'image/webp'),
	]);

	const updated = await StorageFileModel.findOneAndUpdate(
		{ id },
		{ $set: { full, thumb } },
		{ new: true },
	).lean();

	return cleanMongoFields(updated);
}
