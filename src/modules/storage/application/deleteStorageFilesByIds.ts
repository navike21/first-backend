import StorageFileModel from '../infrastructure/StorageFileModel';
import { removeStorageBlobs } from './removeStorageBlobs';

/**
 * Removes specific storage files (blobs + DB records) by their ids, regardless
 * of trash state. Used to compensate a failed insert/update (delete the file
 * that was just uploaded).
 */
export async function deleteStorageFilesByIds(ids: string[]): Promise<void> {
	if (ids.length === 0) return;

	const files = await StorageFileModel.find({ id: { $in: ids } }).lean();
	if (files.length === 0) return;

	await removeStorageBlobs(files);
	await StorageFileModel.deleteMany({ id: { $in: ids } });
}
