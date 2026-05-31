import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import UserModel from '../infrastructure/UserModel';
import { UserNotFoundError } from '../domain/errors/UserErrors';

export async function restoreUser(id: string) {
	const user = await UserModel.findOne({ id, deletedAt: { $ne: null } }).lean();
	if (!user) throw new UserNotFoundError();

	await UserModel.findOneAndUpdate(
		{ id, deletedAt: { $ne: null } },
		{ $unset: { deletedAt: '' } },
	);

	return cleanMongoFields({ ...user, password: undefined, deletedAt: undefined });
}
