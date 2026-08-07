import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { restorePaymentMethod } from '../application/restorePaymentMethod';

export const paymentMethodRestoreController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await restorePaymentMethod(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_PAYMENT_METHOD_RESTORED',
		message: 'SUCCESS_PAYMENT_METHOD_RESTORED',
		ns: 'payments',
		data,
	});
});
