import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { deleteEntityFiles } from '@Modules/storage';
import UserModel from '../infrastructure/UserModel';
import { UserNotFoundError } from '../domain/errors/UserErrors';
import { USER_ENTITY_TYPE } from '../constants/entity';
import { assertUserDeletable } from './assertUserDeletable';

export async function deleteUser(id: string, requesterId?: string) {
	await assertUserDeletable(id, requesterId);
	const user = await UserModel.findOne({ id, deletedAt: { $ne: null } }).lean();
	if (!user) throw new UserNotFoundError();
	await UserModel.deleteOne({ id });
	// Remove the user's stored files (avatar) so no blobs are orphaned.
	await deleteEntityFiles(USER_ENTITY_TYPE, id).catch(() => {});
	return cleanMongoFields({ ...user, password: undefined });
}
