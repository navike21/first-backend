import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { ENV } from '@Constants/environments';
import { CustomerLoginSchema } from '../schemas/customerAuth.schema';
import { loginCustomer } from '../application/loginCustomer';
import {
	CUSTOMER_REFRESH_COOKIE,
	CUSTOMER_AUTH_COOKIE_PATH,
} from '../constants/customerAuthCookies';

export const customerAuthLogin = asyncHandler(async (req, res) => {
	const validated = validate(CustomerLoginSchema, req.body);

	const ip =
		(req.headers['x-forwarded-for'] as string) ??
		req.socket.remoteAddress ??
		'';
	const userAgent = req.headers['user-agent'] ?? '';

	const { accessToken, refreshToken, refreshExpiresMs, customer } =
		await loginCustomer({ ...validated, ip, userAgent });

	res.cookie(CUSTOMER_REFRESH_COOKIE, refreshToken, {
		httpOnly: true,
		secure: ENV.NODE_ENV !== 'test',
		sameSite: 'none',
		maxAge: refreshExpiresMs,
		path: CUSTOMER_AUTH_COOKIE_PATH,
	});

	successResponse(res, {
		statusCode: 200,
		code: 'CUSTOMER_AUTH_LOGIN_SUCCESS',
		message: 'CUSTOMER_AUTH_LOGIN_SUCCESS',
		ns: 'customer-auth',
		data: { accessToken, customer },
	});
});
