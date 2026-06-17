import UserModel from '@Modules/users/infrastructure/UserModel';
import UserGroupModel from '../infrastructure/UserGroupModel';
import { UserGroupNotFoundError } from '../domain/errors/UserGroupErrors';

export interface RemoveMembersBulkResult {
	groupId: string;
	removedIds: string[];
	notFoundIds: string[];
}

/**
 * Removes several users from a group in one operation (idempotent via `$pull`).
 * Unknown or soft-deleted users are reported back in `notFoundIds`.
 */
export async function removeGroupMembersBulk(
	groupId: string,
	userIds: string[],
): Promise<RemoveMembersBulkResult> {
	const group = await UserGroupModel.findOne({ id: groupId, deletedAt: null });
	if (!group) throw new UserGroupNotFoundError();

	const uniqueIds = [...new Set(userIds)];
	// `find().select().lean()` (not `.distinct()`): the prod connection uses
	// MongoDB Stable API v1 (strict), which rejects the `distinct` command.
	const existing = await UserModel.find({
		id: { $in: uniqueIds },
		deletedAt: null,
	})
		.select('id')
		.lean();
	const removedIds = existing.map((u) => u.id);
	const notFoundIds = uniqueIds.filter((id) => !removedIds.includes(id));

	if (removedIds.length > 0) {
		await UserModel.updateMany(
			{ id: { $in: removedIds } },
			{ $pull: { groupIds: groupId } },
		);
	}

	return { groupId, removedIds, notFoundIds };
}
