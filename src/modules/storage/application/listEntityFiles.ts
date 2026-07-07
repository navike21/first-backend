import StorageFileModel from '../infrastructure/StorageFileModel';
import type { StorageFileDocument } from '../infrastructure/StorageFileModel';

export interface ListEntityFilesOptions {
	/** Scope the listing to files uploaded under this field (e.g. 'gallery'). */
	field?: string;
}

/**
 * Reads the stored files attached to an entity without deleting anything.
 * Used to diff a client-submitted "keep these URLs" list against what's
 * actually stored, so the caller can figure out which ones to remove.
 */
export async function listEntityFiles(
	entityType: string,
	entityId: string,
	options: ListEntityFilesOptions = {},
): Promise<StorageFileDocument[]> {
	const filter: Record<string, unknown> = {
		entityType,
		entityId,
		deletedAt: null,
	};
	if (options.field) {
		filter.field = options.field;
	}
	return StorageFileModel.find(filter).lean();
}
