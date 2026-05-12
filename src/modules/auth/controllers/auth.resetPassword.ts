import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import setThrowError from '@Helpers/setThrowError';
import { ResetPasswordSchema } from '../schemas/auth.schema';
import { resetPassword } from '../application/resetPassword';

export const authResetPassword = asyncHandler(async (req, res) => {
	const token = req.params.token as string;
	if (!token)
		setThrowError({
			statusCode: 400,
			code: 'MISSING_TOKEN',
			message: 'Reset token is required',
		});

	const parsed = ResetPasswordSchema.safeParse(req.body);
	if (!parsed.success) {
		setThrowError({
			statusCode: 422,
			code: 'VALIDATION_SCHEMA_ERROR',
			message: 'Validation failed',
		});
	}

	await resetPassword(token, parsed.data.password);

	successResponse(res, {
		statusCode: 200,
		code: 'AUTH_PASSWORD_RESET',
		message: 'AUTH_PASSWORD_RESET',
		ns: 'auth',
		data: null,
	});
});
