import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import UserGroupModel from '../infrastructure/UserGroupModel';
import { UserGroupNotFoundError } from '../domain/errors/UserGroupErrors';

export async function restoreUserGroup(id: string) {
	const group = await UserGroupModel.findOne({ id, deletedAt: { $ne: null } }).lean();
	if (!group) throw new UserGroupNotFoundError();

	await UserGroupModel.findOneAndUpdate(
		{ id, deletedAt: { $ne: null } },
		{ $unset: { deletedAt: '' } },
	);
	return cleanMongoFields({ ...group, deletedAt: undefined });
}
