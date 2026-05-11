import UserModel from '../infrastructure/UserModel';
import { UserNotFoundError } from '../domain/errors/UserErrors';

export async function getUserById(id: string) {
	const user = await UserModel.findOne({ id }).select('-password');
	if (!user) throw new UserNotFoundError();
	return user;
}
