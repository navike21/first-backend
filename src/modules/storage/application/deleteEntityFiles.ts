import StorageFileModel from '../infrastructure/StorageFileModel';
import { removeStorageBlobs } from './removeStorageBlobs';

export interface DeleteEntityFilesOptions {
	/** Storage ids to keep (e.g. a freshly uploaded image during a replacement). */
	exceptStorageIds?: string[];
}

/**
 * Removes every stored file (blobs + DB records) attached to an entity, using
 * the `entityType`/`entityId` anchor recorded at upload time. Used for physical
 * entity purge and, with `exceptStorageIds`, for image replacement (delete the
 * old variants while keeping the new one).
 */
export async function deleteEntityFiles(
	entityType: string,
	entityId: string,
	options: DeleteEntityFilesOptions = {},
): Promise<void> {
	const filter: Record<string, unknown> = { entityType, entityId };
	if (options.exceptStorageIds && options.exceptStorageIds.length > 0) {
		filter.id = { $nin: options.exceptStorageIds };
	}

	const files = await StorageFileModel.find(filter).lean();
	if (files.length === 0) return;

	await removeStorageBlobs(files);
	await StorageFileModel.deleteMany(filter);
}
