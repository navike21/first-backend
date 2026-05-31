import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import StorageFileModel from '../infrastructure/StorageFileModel';

export async function listDeletedStorageFiles({ page, limit }: { page: number; limit: number }) {
	const skip = (page - 1) * limit;
	const [items, total] = await Promise.all([
		StorageFileModel.find({ deletedAt: { $ne: null } }).sort({ deletedAt: -1 }).skip(skip).limit(limit).lean(),
		StorageFileModel.countDocuments({ deletedAt: { $ne: null } }),
	]);
	return {
		items: items.map(cleanMongoFields),
		meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
	};
}
