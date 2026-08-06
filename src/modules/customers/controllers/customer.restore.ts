import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { restoreCustomer } from '../application/restoreCustomer';

export const customerRestoreController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await restoreCustomer(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_CUSTOMER_RESTORED',
		message: 'SUCCESS_CUSTOMER_RESTORED',
		ns: 'customers',
		data,
	});
});
