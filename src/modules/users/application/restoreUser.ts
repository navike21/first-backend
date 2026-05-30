import { ACTIVE, DELETED } from '@Constants/statusRegister';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import UserModel from '../infrastructure/UserModel';
import { UserNotFoundError } from '../domain/errors/UserErrors';

export async function restoreUser(id: string) {
	const user = await UserModel.findOne({ id, status: DELETED }).lean();
	if (!user) throw new UserNotFoundError();

	await UserModel.findOneAndUpdate({ id, status: DELETED }, { $set: { status: ACTIVE } });
	return cleanMongoFields({ ...user, password: undefined, status: ACTIVE });
}
