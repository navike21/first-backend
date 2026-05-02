import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import setThrowError from '@Helpers/setThrowError';
import { verifyEmail } from '../application/verifyEmail';

export const authVerifyEmail = asyncHandler(async (req, res) => {
	const token = req.params.token as string;
	if (!token)
		setThrowError({
			statusCode: 400,
			code: 'MISSING_TOKEN',
			message: 'Verification token is required',
		});

	const data = await verifyEmail(token);
	successResponse(res, {
		statusCode: 200,
		code: 'AUTH_EMAIL_VERIFIED',
		message: 'AUTH_EMAIL_VERIFIED',
		ns: 'auth',
		data,
	});
});
