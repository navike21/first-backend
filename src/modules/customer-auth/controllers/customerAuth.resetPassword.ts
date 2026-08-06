import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { AppError } from '@Shared/domain/AppError';
import { ResetCustomerPasswordSchema } from '../schemas/customerAuth.schema';
import { resetCustomerPassword } from '../application/resetCustomerPassword';

export const customerAuthResetPassword = asyncHandler(async (req, res) => {
	const token = req.params.token as string;
	if (!token) AppError.badRequest('MISSING_TOKEN', 'Reset token is required');

	const validated = validate(ResetCustomerPasswordSchema, req.body);

	await resetCustomerPassword(token, validated.password);

	successResponse(res, {
		statusCode: 200,
		code: 'CUSTOMER_AUTH_PASSWORD_RESET',
		message: 'CUSTOMER_AUTH_PASSWORD_RESET',
		ns: 'customer-auth',
		data: null,
	});
});
