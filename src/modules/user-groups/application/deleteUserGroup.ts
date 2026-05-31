import UserGroupModel from '../infrastructure/UserGroupModel';
import {
	UserGroupNotFoundError,
	SystemGroupModificationError,
} from '../domain/errors/UserGroupErrors';

export async function deleteUserGroup(id: string) {
	const group = await UserGroupModel.findOne({ id, deletedAt: { $ne: null } });
	if (!group) throw new UserGroupNotFoundError();
	if (group.isSystem) throw new SystemGroupModificationError();

	await group.deleteOne();
}
