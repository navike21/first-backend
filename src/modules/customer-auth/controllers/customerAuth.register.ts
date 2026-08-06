import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { registerCustomer } from '../application/registerCustomer';
import { RegisterCustomerSchema } from '../schemas/customerAuth.schema';

export const customerAuthRegister = asyncHandler(async (req, res) => {
	const validated = validate(RegisterCustomerSchema, req.body);

	const data = await registerCustomer(validated);
	successResponse(res, {
		statusCode: 201,
		code: 'CUSTOMER_AUTH_REGISTER_SUCCESS',
		message: 'CUSTOMER_AUTH_REGISTER_SUCCESS',
		ns: 'customer-auth',
		data,
	});
});
