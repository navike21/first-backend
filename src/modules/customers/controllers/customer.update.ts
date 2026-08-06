import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { updateCustomer } from '../application/updateCustomer';
import { UpdateCustomerSchema } from '../schemas/customer.schema';

export const customerUpdateController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const validated = validate(UpdateCustomerSchema, req.body);

	const data = await updateCustomer(id, validated);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_CUSTOMER_UPDATE',
		message: 'SUCCESS_CUSTOMER_UPDATE',
		ns: 'customers',
		data,
	});
});
