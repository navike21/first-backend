import { DELETED } from '@Constants/statusRegister';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import UserGroupModel from '../infrastructure/UserGroupModel';
import {
	UserGroupNotFoundError,
	SystemGroupModificationError,
} from '../domain/errors/UserGroupErrors';

export async function deleteUserGroupLogical(id: string) {
	const group = await UserGroupModel.findOne({
		id,
		status: { $ne: DELETED },
	}).lean();

	if (!group) throw new UserGroupNotFoundError();
	if (group.isSystem) throw new SystemGroupModificationError();

	await UserGroupModel.findOneAndUpdate(
		{ id, status: { $ne: DELETED } },
		{ $set: { status: DELETED } },
	);

	return cleanMongoFields({ ...group, status: DELETED });
}
