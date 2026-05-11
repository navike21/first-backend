import UserGroupModel from '../infrastructure/UserGroupModel';
import { UserGroupNotFoundError } from '../domain/errors/UserGroupErrors';

export async function getUserGroupById(id: string) {
	const group = await UserGroupModel.findOne({ id });
	if (!group) throw new UserGroupNotFoundError();
	return group;
}
