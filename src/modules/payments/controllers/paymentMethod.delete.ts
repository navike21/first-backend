import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { deletePaymentMethodLogical } from '../application/deletePaymentMethodLogical';

export const paymentMethodDeleteController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await deletePaymentMethodLogical(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_PAYMENT_METHOD_DELETED',
		message: 'SUCCESS_PAYMENT_METHOD_DELETED',
		ns: 'payments',
		data,
	});
});
