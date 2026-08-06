import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { logoutCustomer } from '../application/logoutCustomer';
import {
	CUSTOMER_REFRESH_COOKIE,
	CUSTOMER_AUTH_COOKIE_PATH,
} from '../constants/customerAuthCookies';

export const customerAuthLogout = asyncHandler(async (req, res) => {
	const token = req.cookies?.[CUSTOMER_REFRESH_COOKIE] as string | undefined;

	if (token) await logoutCustomer(token);

	res.clearCookie(CUSTOMER_REFRESH_COOKIE, { path: CUSTOMER_AUTH_COOKIE_PATH });

	successResponse(res, {
		statusCode: 200,
		code: 'CUSTOMER_AUTH_LOGOUT_SUCCESS',
		message: 'CUSTOMER_AUTH_LOGOUT_SUCCESS',
		ns: 'customer-auth',
		data: null,
	});
});
