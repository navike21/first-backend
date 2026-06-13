import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import UserModel from '../infrastructure/UserModel';
import { UserNotFoundError } from '../domain/errors/UserErrors';
import { assertUserDeletable } from './assertUserDeletable';

export async function deleteUserLogical(id: string, requesterId?: string) {
	await assertUserDeletable(id, requesterId);

	const user = await UserModel.findOne({ id, deletedAt: null }).lean();
	if (!user) throw new UserNotFoundError();

	await UserModel.findOneAndUpdate(
		{ id, deletedAt: null },
		{ $set: { deletedAt: new Date() } },
	);

	return cleanMongoFields({ ...user, password: undefined });
}
