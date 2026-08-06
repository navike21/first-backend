import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { listCustomers } from '../application/listCustomers';
import { ListCustomersQuerySchema } from '../schemas/customer.schema';

export const customerListController = asyncHandler(async (req, res) => {
	const query = validate(ListCustomersQuerySchema, req.query);
	const { data, meta } = await listCustomers(query);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_CUSTOMER_LIST',
		message: 'SUCCESS_CUSTOMER_LIST',
		ns: 'customers',
		data,
		meta,
	});
});
