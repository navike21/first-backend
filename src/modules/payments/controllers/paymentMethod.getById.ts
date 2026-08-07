import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { getPaymentMethodById } from '../application/getPaymentMethodById';

export const paymentMethodGetByIdController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await getPaymentMethodById(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_PAYMENT_METHOD_FOUND',
		message: 'SUCCESS_PAYMENT_METHOD_FOUND',
		ns: 'payments',
		data,
	});
});
