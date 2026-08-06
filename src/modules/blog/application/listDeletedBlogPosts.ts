import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import BlogModel from '../infrastructure/BlogModel';

export async function listDeletedBlogPosts({
	page,
	limit,
}: {
	page: number;
	limit: number;
}) {
	const skip = (page - 1) * limit;
	const [data, total] = await Promise.all([
		BlogModel.find({ deletedAt: { $ne: null } })
			.sort({ deletedAt: -1 })
			.skip(skip)
			.limit(limit)
			.lean(),
		BlogModel.countDocuments({ deletedAt: { $ne: null } }),
	]);
	return {
		data: data.map(cleanMongoFields),
		meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
	};
}
