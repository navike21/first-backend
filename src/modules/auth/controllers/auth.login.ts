import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import setThrowError from '@Helpers/setThrowError';
import { ENV } from '@Constants/environments';
import { LoginSchema } from '../schemas/auth.schema';
import { loginUser } from '../application/loginUser';
import { REFRESH_COOKIE, AUTH_COOKIE_PATH } from '../constants/authCookies';

export const authLogin = asyncHandler(async (req, res) => {
	const parsed = LoginSchema.safeParse(req.body);
	if (!parsed.success) {
		setThrowError({
			statusCode: 422,
			code: 'VALIDATION_SCHEMA_ERROR',
			message: 'Validation failed',
			details: {
				validation: parsed.error.issues.map((i) => ({
					path: i.path.join('.'),
					message: i.message,
				})),
			},
		});
	}

	const ip =
		(req.headers['x-forwarded-for'] as string) ??
		req.socket.remoteAddress ??
		'';
	const userAgent = req.headers['user-agent'] ?? '';

	const { accessToken, refreshToken, refreshExpiresMs, user } = await loginUser(
		{
			...parsed.data,
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
