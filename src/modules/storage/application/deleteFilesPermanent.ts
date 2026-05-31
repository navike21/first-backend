import { AppError } from '@Shared/domain/AppError';
import StorageFileModel from '../infrastructure/StorageFileModel';
import { getStorageDriver } from '../infrastructure/StorageService';
import { STORAGE_ERRORS } from '../domain/errors/StorageErrors';

export async function deleteFilesPermanent(ids: string[]) {
	const files = await StorageFileModel.find({ id: { $in: ids }, deletedAt: { $ne: null } }).lean();

	if (files.length === 0) {
		AppError.notFound(STORAGE_ERRORS.FILE_NOT_FOUND, 'No files found in trash with the provided IDs');
	}

	const driver = getStorageDriver();

	const urlsToDelete: string[] = [];
	for (const file of files) {
		urlsToDelete.push(file.original.url);
		if (file.full) urlsToDelete.push(file.full.url);
		if (file.thumb) urlsToDelete.push(file.thumb.url);
	}

	await Promise.all(urlsToDelete.map((url) => driver.delete(url)));
	await StorageFileModel.deleteMany({ id: { $in: ids } });
}
