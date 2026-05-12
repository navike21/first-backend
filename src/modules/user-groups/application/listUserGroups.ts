import { ListUserGroupsQuery } from '../schemas/userGroup.schema';
import UserGroupModel from '../infrastructure/UserGroupModel';

export async function listUserGroups({
	page,
	limit,
	status,
	search,
}: ListUserGroupsQuery) {
	const filter: Record<string, unknown> = {};

	if (status) filter.status = status;
	if (search) filter.name = { $regex: search, $options: 'i' };

	const skip = (page - 1) * limit;
	const [items, total] = await Promise.all([
		UserGroupModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
		UserGroupModel.countDocuments(filter),
	]);

	return { items, total, page, limit, pages: Math.ceil(total / limit) };
}
