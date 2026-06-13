import { logError } from '@Helpers/log';
import { getStorageDriver } from '../infrastructure/StorageService';
import type { StorageVariant } from '../infrastructure/StorageFileModel';

interface FileWithVariants {
	original: StorageVariant;
	full?: StorageVariant;
	thumb?: StorageVariant;
}

/**
 * Deletes the underlying blobs (all variants) for the given storage records.
 * Resilient by design: a failed blob deletion is logged but never thrown, since
 * callers use this for compensation, image replacement and entity purge.
 */
export async function removeStorageBlobs(
	files: FileWithVariants[],
): Promise<void> {
	if (files.length === 0) return;

	const driver = getStorageDriver();
	const urls: string[] = [];
	for (const file of files) {
		urls.push(file.original.url);
		if (file.full) urls.push(file.full.url);
		if (file.thumb) urls.push(file.thumb.url);
	}

	const results = await Promise.allSettled(
		urls.map((url) => driver.delete(url)),
	);
	results.forEach((result, index) => {
		if (result.status === 'rejected') {
			logError(
				`[storage] Failed to delete blob ${urls[index]}: ${result.reason}`,
			);
		}
	});
}
