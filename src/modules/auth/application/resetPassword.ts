import { JwtService } from '@Shared/infrastructure/JwtService';
import { UserModel } from '@Modules/users';
import { HashedPassword } from '../domain/value-objects/HashedPassword';
import { InvalidTokenError } from '../domain/errors/AuthErrors';
import { UserNotFoundError } from '@Modules/users/domain/errors/UserErrors';
import RefreshTokenModel from '../infrastructure/RefreshTokenModel';
import SessionModel from '../infrastructure/SessionModel';

export async function resetPassword(token: string, newPassword: string) {
	let payload;
	try {
		payload = JwtService.verifyEmail(token);
	} catch {
		throw new InvalidTokenError();
	}

	if (payload.type !== 'password_reset') throw new InvalidTokenError();

	const user = await UserModel.findOne({ id: payload.sub });
	if (!user) throw new UserNotFoundError();

	// Single-use: reject a token issued before the last password change, so a
	// reset link cannot be replayed after it has already been used.
	const issuedAtMs = (payload.iat ?? 0) * 1000;
	if (user.passwordChangedAt && issuedAtMs < user.passwordChangedAt.getTime()) {
		throw new InvalidTokenError();
	}

	const newHash = await HashedPassword.hash(newPassword);

	await Promise.all([
		UserModel.findOneAndUpdate(
			{ id: payload.sub },
			{ $set: { password: newHash, passwordChangedAt: new Date() } },
		),
		RefreshTokenModel.updateMany(
			{ userId: payload.sub, revokedAt: { $exists: false } },
			{ $set: { revokedAt: new Date() } },
		),
		SessionModel.deleteMany({ userId: payload.sub }),
	]);
}
