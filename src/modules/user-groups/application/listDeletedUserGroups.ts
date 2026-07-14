import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import UserGroupModel from '../infrastructure/UserGroupModel';

export async function listDeletedUserGroups({
	page,
	limit,
}: {
	page: number;
	limit: number;
}) {
	const skip = (page - 1) * limit;
	const [items, total] = await Promise.all([
		UserGroupModel.find({ deletedAt: { $ne: null } })
			.sort({ deletedAt: -1 })
			.skip(skip)
			.limit(limit)
			.lean(),
		UserGroupModel.countDocuments({ deletedAt: { $ne: null } }),
	]);
	return {
		items: items.map(cleanMongoFields),
		total,
		page,
		limit,
		pages: Math.ceil(total / limit),
	};
}
