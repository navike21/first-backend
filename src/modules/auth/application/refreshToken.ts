import generateUUID from '@Helpers/uuid';
import { JwtService } from '@Shared/infrastructure/JwtService';
import { UserModel } from '@Modules/users';
import {
	InvalidTokenError,
	TokenReuseDetectedError,
} from '../domain/errors/AuthErrors';
import RefreshTokenModel from '../infrastructure/RefreshTokenModel';
import { REFRESH_EXPIRES_MS } from '../constants/authCookies';
import { loadUserPermissions } from './loadUserPermissions';

export async function rotateRefreshToken(
	incomingToken: string,
	userAgent: string,
	ip: string,
) {
	let payload;
	try {
		payload = JwtService.verifyRefresh(incomingToken);
	} catch {
		throw new InvalidTokenError();
	}

	const storedToken = await RefreshTokenModel.findOne({ jti: payload.jti });
	if (!storedToken) throw new InvalidTokenError();

	if (storedToken.revokedAt) {
		await RefreshTokenModel.updateMany(
			{ userId: storedToken.userId },
			{ $set: { revokedAt: new Date() } },
		);
		throw new TokenReuseDetectedError();
	}

	const user = await UserModel.findOne({ id: payload.sub });
	if (!user) throw new InvalidTokenError();

	const permissions = await loadUserPermissions(user.groupIds);

	const newJti = generateUUID();
	const newAccessToken = JwtService.signAccess({
		sub: user.id,
		permissions,
		firstName: user.firstName,
		lastName: user.lastName,
		email: user.email,
	});
	const newRefreshToken = JwtService.signRefresh({ sub: user.id, jti: newJti });

	const expiresAt = new Date(Date.now() + REFRESH_EXPIRES_MS);

	await Promise.all([
		RefreshTokenModel.findOneAndUpdate(
			{ jti: payload.jti },
			{ $set: { revokedAt: new Date(), replacedBy: newJti } },
		),
		RefreshTokenModel.create({
			jti: newJti,
			userId: user.id,
			userAgent,
			ip,
			expiresAt,
		}),
	]);

	return {
		accessToken: newAccessToken,
		refreshToken: newRefreshToken,
		refreshExpiresMs: REFRESH_EXPIRES_MS,
	};
}
