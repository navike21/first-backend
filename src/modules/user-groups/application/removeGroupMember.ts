import UserModel from '@Modules/users/infrastructure/UserModel';
import { UserNotFoundError } from '@Modules/users/domain/errors/UserErrors';
import UserGroupModel from '../infrastructure/UserGroupModel';
import { UserGroupNotFoundError } from '../domain/errors/UserGroupErrors';

export interface RemoveMemberResult {
	groupId: string;
	userId: string;
}

/**
 * Removes a single user from a group (idempotent via `$pull`). Throws if the
 * group or the user does not exist.
 */
export async function removeGroupMember(
	groupId: string,
	userId: string,
): Promise<RemoveMemberResult> {
	const group = await UserGroupModel.findOne({ id: groupId, deletedAt: null });
	if (!group) throw new UserGroupNotFoundError();

	const user = await UserModel.findOne({ id: userId, deletedAt: null });
	if (!user) throw new UserNotFoundError();

	await UserModel.updateOne(
		{ id: userId },
		{ $pull: { groupIds: groupId } },
	);

	return { groupId, userId };
}
