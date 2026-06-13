import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { AppError } from '@Shared/domain/AppError';
import { ResetPasswordSchema } from '../schemas/auth.schema';
import { resetPassword } from '../application/resetPassword';

export const authResetPassword = asyncHandler(async (req, res) => {
	const token = req.params.token as string;
	if (!token)
		AppError.badRequest('MISSING_TOKEN', 'Reset token is required');

	const validated = validate(ResetPasswordSchema, req.body);

	await resetPassword(token, validated.password);

	successResponse(res, {
		statusCode: 200,
		code: 'AUTH_PASSWORD_RESET',
		message: 'AUTH_PASSWORD_RESET',
		ns: 'auth',
		data: null,
	});
});
