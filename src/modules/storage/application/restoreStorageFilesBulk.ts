import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import StorageFileModel from '../infrastructure/StorageFileModel';

export async function restoreStorageFilesBulk(ids: string[]) {
	const files = await StorageFileModel.find({ id: { $in: ids }, deletedAt: { $ne: null } }).lean();

	const processedIds = files.map((f) => f.id).filter((id): id is string => Boolean(id));
	const notFoundIds = ids.filter((id) => !processedIds.includes(id));

	if (processedIds.length === 0) {
		return { processed: [], processedIds: [], notFoundIds };
	}

	await StorageFileModel.updateMany(
		{ id: { $in: processedIds }, deletedAt: { $ne: null } },
		{ $unset: { deletedAt: '' } },
	);

	return {
		processed: files.map((f) => cleanMongoFields({ ...f, deletedAt: undefined })),
		processedIds,
		notFoundIds,
	};
}
