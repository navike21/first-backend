import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import UserGroupModel from '../infrastructure/UserGroupModel';
import {
	UserGroupNotFoundError,
	SystemGroupModificationError,
} from '../domain/errors/UserGroupErrors';

export async function deleteUserGroupLogical(id: string) {
	const group = await UserGroupModel.findOne({
		id,
		deletedAt: null,
	}).lean();

	if (!group) throw new UserGroupNotFoundError();
	if (group.isSystem) throw new SystemGroupModificationError();

	await UserGroupModel.findOneAndUpdate(
		{ id, deletedAt: null },
		{ $set: { deletedAt: new Date() } },
	);

	return cleanMongoFields({ ...group, deletedAt: new Date() });
}
