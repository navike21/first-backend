import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { createCustomer } from '../application/createCustomer';
import { CreateCustomerSchema } from '../schemas/customer.schema';

export const customerCreateController = asyncHandler(async (req, res) => {
	const validated = validate(CreateCustomerSchema, req.body);

	const data = await createCustomer(validated);
	successResponse(res, {
		statusCode: 201,
		code: 'SUCCESS_CUSTOMER_CREATE',
		message: 'SUCCESS_CUSTOMER_CREATE',
		ns: 'customers',
		data,
	});
});
