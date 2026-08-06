import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { ForgotCustomerPasswordSchema } from '../schemas/customerAuth.schema';
import { forgotCustomerPassword } from '../application/forgotCustomerPassword';

export const customerAuthForgotPassword = asyncHandler(async (req, res) => {
	const validated = validate(ForgotCustomerPasswordSchema, req.body);

	await forgotCustomerPassword(validated.email, res.locals.lang as string);

	// Siempre responde igual — no revelar si el email existe
	successResponse(res, {
		statusCode: 200,
		code: 'CUSTOMER_AUTH_FORGOT_PASSWORD_SENT',
		message: 'CUSTOMER_AUTH_FORGOT_PASSWORD_SENT',
		ns: 'customer-auth',
		data: null,
	});
});
