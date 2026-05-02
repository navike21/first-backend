import UserModel from '../infrastructure/UserModel';
import { UserNotFoundError } from '../domain/errors/UserErrors';

export async function getMyProfile(userId: string) {
	const user = await UserModel.findOne({ id: userId }).select('-password');
	if (!user) throw new UserNotFoundError();
	return user;
}
