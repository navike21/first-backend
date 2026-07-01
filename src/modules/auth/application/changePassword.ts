import { UserModel } from '@Modules/users';
import { HashedPassword } from '../domain/value-objects/HashedPassword';
import { InvalidCredentialsError } from '../domain/errors/AuthErrors';
import { UserNotFoundError } from '@Modules/users/domain/errors/UserErrors';
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

	// Passwordless user (invite flow): no current password to verify against —
	// they must set one via forgot-password, not change it here.
	if (!user.password) throw new InvalidCredentialsError();

	const isValid = await HashedPassword.compare(currentPassword, user.password);
	if (!isValid) throw new InvalidCredentialsError();

	const newHash = await HashedPassword.hash(newPassword);

	await Promise.all([
		UserModel.findOneAndUpdate(
			{ id: userId },
			{ $set: { password: newHash, passwordChangedAt: new Date() } },
		),
		RefreshTokenModel.updateMany(
			{ userId, revokedAt: { $exists: false } },
			{ $set: { revokedAt: new Date() } },
		),
		SessionModel.deleteMany({ userId }),
	]);
}
