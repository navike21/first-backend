import UserModel from '@Modules/users/infrastructure/UserModel';
import UserGroupModel from '../infrastructure/UserGroupModel';
import {
	UserGroupNotFoundError,
	SystemGroupModificationError,
} from '../domain/errors/UserGroupErrors';

export async function deleteUserGroup(id: string) {
	const group = await UserGroupModel.findOne({ id, deletedAt: { $ne: null } });
	if (!group) throw new UserGroupNotFoundError();
	if (group.isSystem) throw new SystemGroupModificationError();

	// Membership lives in `User.groupIds`. Pull the reference from EVERY user
	// (incl. soft-deleted) before destroying the group, so a physical purge
	// never leaves dangling group ids — not even ones a restored user would
	// otherwise recover.
	await UserModel.updateMany({ groupIds: id }, { $pull: { groupIds: id } });

	await group.deleteOne();
}
