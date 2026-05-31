import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { AppError } from '@Shared/domain/AppError';
import StorageFileModel from '../infrastructure/StorageFileModel';

export async function restoreStorageFile(id: string) {
	const file = await StorageFileModel.findOne({ id, deletedAt: { $ne: null } }).lean();
	if (!file) AppError.notFound('STORAGE_FILE_NOT_FOUND', 'File not found in trash');

	await StorageFileModel.findOneAndUpdate(
		{ id, deletedAt: { $ne: null } },
		{ $unset: { deletedAt: '' } },
	);
	return cleanMongoFields({ ...file, deletedAt: undefined });
}
