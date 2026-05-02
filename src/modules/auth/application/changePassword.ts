import { UserModel } from '@Modules/users';
import { HashedPassword } from '../domain/value-objects/HashedPassword';
import {
	InvalidCredentialsError,
	UserNotFoundError,
} from '../domain/errors/AuthErrors';
import RefreshTokenModel from '../infrastructure/RefreshTokenModel';
import SessionModel from '../infrastructure/SessionModel';

interface ChangePasswordInput {
	userId: string;
	currentPassword: string;
	newPassword: string;
}

export async function changePassword({
	userId,
	currentPassword,
	newPassword,
}: ChangePasswordInput) {
	const user = await UserModel.findOne({ id: userId });
	if (!user) throw new UserNotFoundError();

	const isValid = await HashedPassword.compare(currentPassword, user.password);
	if (!isValid) throw new InvalidCredentialsError();

	const newHash = await HashedPassword.hash(newPassword);

	await Promise.all([
		UserModel.findOneAndUpdate({ id: userId }, { $set: { password: newHash } }),
		RefreshTokenModel.updateMany(
			{ userId, revokedAt: { $exists: false } },
			{ $set: { revokedAt: new Date() } },
		),
		SessionModel.deleteMany({ userId }),
	]);
}
