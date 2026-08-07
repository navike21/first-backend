import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { listPaymentMethods } from '../application/listPaymentMethods';
import { ListPaymentMethodsQuerySchema } from '../schemas/paymentMethod.schema';

export const paymentMethodListController = asyncHandler(async (req, res) => {
	const query = validate(ListPaymentMethodsQuerySchema, req.query);
	const { data, meta } = await listPaymentMethods(query);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_PAYMENT_METHOD_LIST',
		message: 'SUCCESS_PAYMENT_METHOD_LIST',
		ns: 'payments',
		data,
		meta,
	});
});
