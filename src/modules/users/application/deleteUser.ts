import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import UserModel from '../infrastructure/UserModel';
import { UserNotFoundError } from '../domain/errors/UserErrors';

export async function deleteUser(id: string) {
	const user = await UserModel.findOne({ id, deletedAt: { $ne: null } }).lean();
	if (!user) throw new UserNotFoundError();
	await UserModel.deleteOne({ id });
	return cleanMongoFields({ ...user, password: undefined });
}
