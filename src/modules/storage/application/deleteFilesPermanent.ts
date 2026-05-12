import setThrowError from '@Helpers/setThrowError';
import StorageFileModel from '../infrastructure/StorageFileModel';
import { getStorageDriver } from '../infrastructure/StorageService';
import { STORAGE_ERRORS } from '../domain/errors/StorageErrors';

export async function deleteFilesPermanent(ids: string[]) {
	const files = await StorageFileModel.find({ id: { $in: ids } }).lean();

	if (files.length === 0) {
		setThrowError({
			statusCode: 404,
			code: STORAGE_ERRORS.FILE_NOT_FOUND,
			message: 'No files found with the provided IDs',
		});
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
