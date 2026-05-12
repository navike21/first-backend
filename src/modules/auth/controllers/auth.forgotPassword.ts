import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import setThrowError from '@Helpers/setThrowError';
import { ForgotPasswordSchema } from '../schemas/auth.schema';
import { forgotPassword } from '../application/forgotPassword';

export const authForgotPassword = asyncHandler(async (req, res) => {
	const parsed = ForgotPasswordSchema.safeParse(req.body);
	if (!parsed.success) {
		setThrowError({
			statusCode: 422,
			code: 'VALIDATION_SCHEMA_ERROR',
			message: 'Validation failed',
		});
	}

	await forgotPassword(parsed.data.email, res.locals.lang as string);

	// Siempre responde igual — no revelar si el email existe
	successResponse(res, {
		statusCode: 200,
		code: 'AUTH_FORGOT_PASSWORD_SENT',
		message: 'AUTH_FORGOT_PASSWORD_SENT',
		ns: 'auth',
		data: null,
	});
});
