import { DELETED } from '@Constants/statusRegister';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import UserModel from '../infrastructure/UserModel';
import { UserNotFoundError } from '../domain/errors/UserErrors';

export async function deleteUserLogical(id: string) {
	const user = await UserModel.findOne({ id, status: { $ne: DELETED } }).lean();
	if (!user) throw new UserNotFoundError();

	await UserModel.findOneAndUpdate(
		{ id, status: { $ne: DELETED } },
		{ $set: { status: DELETED } },
	);

	return cleanMongoFields({ ...user, status: DELETED, password: undefined });
}
