import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import CategoryModel from '../infrastructure/CategoryModel';

export async function listDeletedCategories({ page, limit }: { page: number; limit: number }) {
	const skip = (page - 1) * limit;
	const [data, total] = await Promise.all([
		CategoryModel.find({ deletedAt: { $ne: null } }).sort({ deletedAt: -1 }).skip(skip).limit(limit).lean(),
		CategoryModel.countDocuments({ deletedAt: { $ne: null } }),
	]);
	return {
		data: data.map(cleanMongoFields),
		meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
	};
}
