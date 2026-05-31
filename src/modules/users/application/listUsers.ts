import { ListUsersQuery } from '../schemas/user.schema';
import UserModel from '../infrastructure/UserModel';

export async function listUsers({
	page,
	limit,
	status,
	search,
	groupId,
}: ListUsersQuery) {
	const filter: Record<string, unknown> = { deletedAt: null };

	if (status) filter.status = status;
	if (groupId) filter.groupId = groupId;
	if (search) {
		filter.$or = [
			{ firstName: { $regex: search, $options: 'i' } },
			{ lastName: { $regex: search, $options: 'i' } },
			{ email: { $regex: search, $options: 'i' } },
		];
	}

	const skip = (page - 1) * limit;
	const [items, total] = await Promise.all([
		UserModel.find(filter)
			.select('-password')
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit),
		UserModel.countDocuments(filter),
	]);

	return { items, total, page, limit, pages: Math.ceil(total / limit) };
}
