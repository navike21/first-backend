import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { deleteCustomerLogical } from '../application/deleteCustomerLogical';

export const customerDeleteController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await deleteCustomerLogical(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_CUSTOMER_DELETED',
		message: 'SUCCESS_CUSTOMER_DELETED',
		ns: 'customers',
		data,
	});
});
