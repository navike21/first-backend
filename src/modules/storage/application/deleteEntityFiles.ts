import StorageFileModel from '../infrastructure/StorageFileModel';
import { removeStorageBlobs } from './removeStorageBlobs';

export interface DeleteEntityFilesOptions {
	/** Storage ids to keep (e.g. a freshly uploaded image during a replacement). */
	exceptStorageIds?: string[];
	/** Scope the deletion to files uploaded under this field (e.g. 'cover'), leaving other fields (e.g. 'gallery') untouched. */
	field?: string;
}

/**
 * Removes stored files (blobs + DB records) attached to an entity, using the
 * `entityType`/`entityId` anchor recorded at upload time. Used for physical
 * entity purge (no options — wipes everything) and, with `exceptStorageIds`
 * and/or `field`, for image replacement (delete the old variants of one field
 * while keeping the new one and any other field's files untouched).
 */
export async function deleteEntityFiles(
	entityType: string,
	entityId: string,
	options: DeleteEntityFilesOptions = {},
): Promise<void> {
	const filter: Record<string, unknown> = { entityType, entityId };
	if (options.field) {
		filter.field = options.field;
	}
	if (options.exceptStorageIds && options.exceptStorageIds.length > 0) {
		filter.id = { $nin: options.exceptStorageIds };
	}

	const files = await StorageFileModel.find(filter).lean();
	if (files.length === 0) return;

	await removeStorageBlobs(files);
	await StorageFileModel.deleteMany(filter);
}
