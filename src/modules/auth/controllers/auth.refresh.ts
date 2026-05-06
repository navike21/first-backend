import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import setThrowError from '@Helpers/setThrowError';
import { ENV } from '@Constants/environments';
import { rotateRefreshToken } from '../application/refreshToken';
import { REFRESH_COOKIE, AUTH_COOKIE_PATH } from '../constants/authCookies';

export const authRefresh = asyncHandler(async (req, res) => {
	const token = req.cookies?.[REFRESH_COOKIE] as string | undefined;

	if (!token) {
		setThrowError({
			statusCode: 401,
			code: 'UNAUTHORIZED',
			message: 'Refresh token not found',
		});
	}

	const ip =
		(req.headers['x-forwarded-for'] as string) ??
		req.socket.remoteAddress ??
		'';
	const userAgent = req.headers['user-agent'] ?? '';

	const { accessToken, refreshToken, refreshExpiresMs } =
		await rotateRefreshToken(token, ip, userAgent);

	res.cookie(REFRESH_COOKIE, refreshToken, {
		httpOnly: true,
		secure: ENV.NODE_ENV === 'production',
		sameSite: 'strict',
		maxAge: refreshExpiresMs,
		path: AUTH_COOKIE_PATH,
	});

	successResponse(res, {
		statusCode: 200,
		code: 'AUTH_REFRESH_SUCCESS',
		message: 'AUTH_REFRESH_SUCCESS',
		ns: 'auth',
		data: { accessToken },
	});
});
