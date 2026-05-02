import generateUUID from '@Helpers/uuid';
import { JwtService } from '@Shared/infrastructure/JwtService';
import { UserModel } from '@Modules/users';
import { UserGroupModel } from '@Modules/user-groups';
import {
	InvalidTokenError,
	TokenReuseDetectedError,
} from '../domain/errors/AuthErrors';
import RefreshTokenModel from '../infrastructure/RefreshTokenModel';

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

	const permissions: string[] = [];
	if (user.groupId) {
		const group = await UserGroupModel.findOne({ id: user.groupId });
		if (group) permissions.push(...group.permissions);
	}

	const newJti = generateUUID();
	const newAccessToken = JwtService.signAccess({ sub: user.id, permissions });
	const newRefreshToken = JwtService.signRefresh({ sub: user.id, jti: newJti });

	const refreshExpiresMs = 7 * 24 * 60 * 60 * 1000;
	const expiresAt = new Date(Date.now() + refreshExpiresMs);

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
		refreshExpiresMs,
	};
}
