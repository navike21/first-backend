import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import TagModel from '../infrastructure/TagModel';

export async function listDeletedTags({ page, limit }: { page: number; limit: number }) {
	const skip = (page - 1) * limit;
	const [data, total] = await Promise.all([
		TagModel.find({ deletedAt: { $ne: null } }).sort({ deletedAt: -1 }).skip(skip).limit(limit).lean(),
		TagModel.countDocuments({ deletedAt: { $ne: null } }),
	]);
	return {
		data: data.map(cleanMongoFields),
		meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
	};
}
