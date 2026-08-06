import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { deleteCustomerPhysical } from '../application/deleteCustomerPhysical';

export const customerDeletePermanentController = asyncHandler(
	async (req, res) => {
		const id = String(req.params.id);
		const data = await deleteCustomerPhysical(id);
		successResponse(res, {
			statusCode: 200,
			code: 'SUCCESS_CUSTOMER_PURGED',
			message: 'SUCCESS_CUSTOMER_PURGED',
			ns: 'customers',
			data,
		});
	},
);
