import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { AppError } from '@Shared/domain/AppError';
import { ENV } from '@Constants/environments';
import { rotateCustomerRefreshToken } from '../application/refreshCustomerToken';
import {
	CUSTOMER_REFRESH_COOKIE,
	CUSTOMER_AUTH_COOKIE_PATH,
} from '../constants/customerAuthCookies';

export const customerAuthRefresh = asyncHandler(async (req, res) => {
	const token = req.cookies?.[CUSTOMER_REFRESH_COOKIE] as string | undefined;

	if (!token) {
		AppError.unauthorized('UNAUTHORIZED', 'Refresh token not found');
	}

	const ip =
		(req.headers['x-forwarded-for'] as string) ??
		req.socket.remoteAddress ??
		'';
	const userAgent = req.headers['user-agent'] ?? '';

	const { accessToken, refreshToken, refreshExpiresMs } =
		await rotateCustomerRefreshToken(token, userAgent, ip);

	res.cookie(CUSTOMER_REFRESH_COOKIE, refreshToken, {
		httpOnly: true,
		secure: ENV.NODE_ENV !== 'test',
		sameSite: 'none',
		maxAge: refreshExpiresMs,
		path: CUSTOMER_AUTH_COOKIE_PATH,
	});

	successResponse(res, {
		statusCode: 200,
		code: 'CUSTOMER_AUTH_REFRESH_SUCCESS',
		message: 'CUSTOMER_AUTH_REFRESH_SUCCESS',
		ns: 'customer-auth',
		data: { accessToken },
	});
});
