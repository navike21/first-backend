import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { AppError } from '@Shared/domain/AppError';
import StorageFileModel from '../infrastructure/StorageFileModel';
import { STORAGE_ERRORS } from '../domain/errors/StorageErrors';

export async function deleteFilesLogical(ids: string[]) {
	const files = await StorageFileModel.find({
		id: { $in: ids },
		deletedAt: null,
	}).lean();

	if (files.length === 0) {
		AppError.notFound(
			STORAGE_ERRORS.FILE_NOT_FOUND,
			'No active files found with the provided IDs',
		);
	}

	await StorageFileModel.updateMany(
		{ id: { $in: ids }, deletedAt: null },
		{ $set: { deletedAt: new Date() } },
	);

	return files.map(cleanMongoFields);
}
