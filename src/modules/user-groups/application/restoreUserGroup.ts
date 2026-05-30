import { ACTIVE, DELETED } from '@Constants/statusRegister';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import UserGroupModel from '../infrastructure/UserGroupModel';
import { UserGroupNotFoundError } from '../domain/errors/UserGroupErrors';

export async function restoreUserGroup(id: string) {
	const group = await UserGroupModel.findOne({ id, status: DELETED }).lean();
	if (!group) throw new UserGroupNotFoundError();

	await UserGroupModel.findOneAndUpdate({ id, status: DELETED }, { $set: { status: ACTIVE } });
	return cleanMongoFields({ ...group, status: ACTIVE });
}
