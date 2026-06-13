import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { ENV } from '@Constants/environments';
import { LoginSchema } from '../schemas/auth.schema';
import { loginUser } from '../application/loginUser';
import { REFRESH_COOKIE, AUTH_COOKIE_PATH } from '../constants/authCookies';

export const authLogin = asyncHandler(async (req, res) => {
	const validated = validate(LoginSchema, req.body);

	const ip =
		(req.headers['x-forwarded-for'] as string) ??
		req.socket.remoteAddress ??
		'';
	const userAgent = req.headers['user-agent'] ?? '';

	const { accessToken, refreshToken, refreshExpiresMs, user } = await loginUser(
		{
			...validated,
			ip,
			userAgent,
		},
	);

	res.cookie(REFRESH_COOKIE, refreshToken, {
		httpOnly: true,
		secure: ENV.NODE_ENV === 'production',
		sameSite: 'strict',
		maxAge: refreshExpiresMs,
		path: AUTH_COOKIE_PATH,
	});

	successResponse(res, {
		statusCode: 200,
		code: 'AUTH_LOGIN_SUCCESS',
		message: 'AUTH_LOGIN_SUCCESS',
		ns: 'auth',
		data: { accessToken, user },
	});
});
