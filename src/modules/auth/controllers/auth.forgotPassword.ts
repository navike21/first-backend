import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { ForgotPasswordSchema } from '../schemas/auth.schema';
import { forgotPassword } from '../application/forgotPassword';

export const authForgotPassword = asyncHandler(async (req, res) => {
	const validated = validate(ForgotPasswordSchema, req.body);

	await forgotPassword(validated.email, res.locals.lang as string);

	// Siempre responde igual — no revelar si el email existe
	successResponse(res, {
		statusCode: 200,
		code: 'AUTH_FORGOT_PASSWORD_SENT',
		message: 'AUTH_FORGOT_PASSWORD_SENT',
		ns: 'auth',
		data: null,
	});
});
