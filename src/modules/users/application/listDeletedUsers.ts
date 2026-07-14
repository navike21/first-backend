import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import UserModel from '../infrastructure/UserModel';

export async function listDeletedUsers({
	page,
	limit,
}: {
	page: number;
	limit: number;
}) {
	const skip = (page - 1) * limit;
	const [items, total] = await Promise.all([
		UserModel.find({ deletedAt: { $ne: null } })
			.select('-password')
			.sort({ deletedAt: -1 })
			.skip(skip)
			.limit(limit)
			.lean(),
		UserModel.countDocuments({ deletedAt: { $ne: null } }),
	]);
	return {
		items: items.map(cleanMongoFields),
		total,
		page,
		limit,
		pages: Math.ceil(total / limit),
	};
}
