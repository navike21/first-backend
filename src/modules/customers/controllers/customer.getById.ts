import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { getCustomerById } from '../application/getCustomerById';

export const customerGetByIdController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await getCustomerById(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_CUSTOMER_FOUND',
		message: 'SUCCESS_CUSTOMER_FOUND',
		ns: 'customers',
		data,
	});
});
