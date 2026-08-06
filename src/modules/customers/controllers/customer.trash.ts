import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { listDeletedCustomers } from '../application/listDeletedCustomers';

export const customerTrashController = asyncHandler(async (req, res) => {
	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 20;
	const { data, meta } = await listDeletedCustomers({ page, limit });
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_CUSTOMER_TRASH_LIST',
		message: 'SUCCESS_CUSTOMER_TRASH_LIST',
		ns: 'customers',
		data,
		meta,
	});
});
