import UserModel from '@Modules/users/infrastructure/UserModel';
import UserGroupModel from '../infrastructure/UserGroupModel';
import { UserGroupNotFoundError } from '../domain/errors/UserGroupErrors';

export interface AddMembersResult {
	groupId: string;
	addedIds: string[];
	notFoundIds: string[];
}

/**
 * Adds the given active users to a group (idempotent via `$addToSet`).
 * Unknown or soft-deleted users are reported back in `notFoundIds`.
 */
export async function addGroupMembers(
	groupId: string,
	userIds: string[],
): Promise<AddMembersResult> {
	const group = await UserGroupModel.findOne({ id: groupId, deletedAt: null });
	if (!group) throw new UserGroupNotFoundError();

	const uniqueIds = [...new Set(userIds)];
	const existingIds = await UserModel.find({
		id: { $in: uniqueIds },
		deletedAt: null,
	}).distinct('id');

	const notFoundIds = uniqueIds.filter((id) => !existingIds.includes(id));

	if (existingIds.length > 0) {
		await UserModel.updateMany(
			{ id: { $in: existingIds } },
			{ $addToSet: { groupIds: groupId } },
		);
	}

	return { groupId, addedIds: existingIds, notFoundIds };
}
