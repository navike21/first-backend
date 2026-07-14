import UserModel from '@Modules/users/infrastructure/UserModel';
import { escapeRegex } from '@Helpers/escapeRegex';
import UserGroupModel from '../infrastructure/UserGroupModel';
import { UserGroupNotFoundError } from '../domain/errors/UserGroupErrors';
import { ListGroupMembersQuery } from '../schemas/userGroup.schema';

/**
 * Lists the active users that belong to a group (membership lives in
 * `User.groupIds`). Imports the user model directly to avoid the
 * user-groups ↔ users module import cycle.
 */
export async function listGroupMembers(
	groupId: string,
	{ page, limit, status, search }: ListGroupMembersQuery,
) {
	const group = await UserGroupModel.findOne({ id: groupId, deletedAt: null });
	if (!group) throw new UserGroupNotFoundError();

	const filter: Record<string, unknown> = { groupIds: groupId, deletedAt: null };
	if (status) filter.status = status;
	if (search) {
		const pattern = escapeRegex(search);
		filter.$or = [
			{ firstName: { $regex: pattern, $options: 'i' } },
			{ lastName: { $regex: pattern, $options: 'i' } },
			{ email: { $regex: pattern, $options: 'i' } },
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
