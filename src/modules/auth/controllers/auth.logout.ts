import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { logoutUser } from '../application/logoutUser';
import { REFRESH_COOKIE, AUTH_COOKIE_PATH } from '../constants/authCookies';

export const authLogout = asyncHandler(async (req, res) => {
	const token = req.cookies?.[REFRESH_COOKIE] as string | undefined;

	if (token) await logoutUser(token);

	res.clearCookie(REFRESH_COOKIE, { path: AUTH_COOKIE_PATH });

	successResponse(res, {
		statusCode: 200,
		code: 'AUTH_LOGOUT_SUCCESS',
		message: 'AUTH_LOGOUT_SUCCESS',
		ns: 'auth',
		data: null,
	});
});
