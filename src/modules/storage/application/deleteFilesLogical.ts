import { ACTIVE, DELETED } from '@Constants/statusRegister';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import setThrowError from '@Helpers/setThrowError';
import StorageFileModel from '../infrastructure/StorageFileModel';
import { STORAGE_ERRORS } from '../domain/errors/StorageErrors';

export async function deleteFilesLogical(ids: string[]) {
	const files = await StorageFileModel.find({
		id: { $in: ids },
		status: ACTIVE,
	}).lean();

	if (files.length === 0) {
		setThrowError({
			statusCode: 404,
			code: STORAGE_ERRORS.FILE_NOT_FOUND,
			message: 'No active files found with the provided IDs',
		});
	}

	await StorageFileModel.updateMany(
		{ id: { $in: ids }, status: ACTIVE },
		{ $set: { status: DELETED, deletedAt: new Date() } },
	);

	return files.map(cleanMongoFields);
}
