import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { AppError } from '@Shared/domain/AppError';
import { verifyEmail } from '../application/verifyEmail';

export const authVerifyEmail = asyncHandler(async (req, res) => {
	const token = req.params.token as string;
	if (!token)
		AppError.badRequest('MISSING_TOKEN', 'Verification token is required');

	const data = await verifyEmail(token, res.locals.lang as string);
	successResponse(res, {
		statusCode: 200,
		code: 'AUTH_EMAIL_VERIFIED',
		message: 'AUTH_EMAIL_VERIFIED',
		ns: 'auth',
		data,
	});
});
