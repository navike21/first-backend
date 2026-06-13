import generateUUID from '@Helpers/uuid';
import { JwtService } from '@Shared/infrastructure/JwtService';
import { emitSessionUpdate } from '@Shared/infrastructure/SocketServer';
import { UserModel } from '@Modules/users';
import { HashedPassword } from '../domain/value-objects/HashedPassword';
import {
	InvalidCredentialsError,
	EmailNotVerifiedError,
} from '../domain/errors/AuthErrors';
import RefreshTokenModel from '../infrastructure/RefreshTokenModel';
import SessionModel from '../infrastructure/SessionModel';
import { REFRESH_EXPIRES_MS } from '../constants/authCookies';
import { loadUserPermissions } from './loadUserPermissions';

interface LoginInput {
	email: string;
	password: string;
	userAgent: string;
	ip: string;
}

export async function loginUser({
	email,
	password,
	userAgent,
	ip,
}: LoginInput) {
	const user = await UserModel.findOne({ email: email.toLowerCase() });
	if (!user) throw new InvalidCredentialsError();

	const isValid = await HashedPassword.compare(password, user.password);
	if (!isValid) throw new InvalidCredentialsError();

	if (!user.isEmailVerified) throw new EmailNotVerifiedError();

	const permissions = await loadUserPermissions(user.groupId);

	const jti = generateUUID();
	const accessToken = JwtService.signAccess({ sub: user.id, permissions });
	const refreshToken = JwtService.signRefresh({ sub: user.id, jti });

	const expiresAt = new Date(Date.now() + REFRESH_EXPIRES_MS);

	await Promise.all([
		RefreshTokenModel.create({
			jti,
			userId: user.id,
			userAgent,
			ip,
			expiresAt,
		}),
		SessionModel.create({ userId: user.id, userAgent, ip }),
	]);

	emitSessionUpdate('login', { userId: user.id });

	return {
		accessToken,
		refreshToken,
		refreshExpiresMs: REFRESH_EXPIRES_MS,
		user: {
			id: user.id,
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			profilePictureUrl: user.profilePictureUrl,
			preferences: user.preferences,
			permissions,
		},
	};
}
