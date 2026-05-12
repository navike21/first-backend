import UserModel from '../infrastructure/UserModel';
import { UserNotFoundError } from '../domain/errors/UserErrors';

export async function deleteUser(id: string) {
	const user = await UserModel.findOne({ id });
	if (!user) throw new UserNotFoundError();
	await user.deleteOne();
}
