import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { deletePaymentMethodPhysical } from '../application/deletePaymentMethodPhysical';

export const paymentMethodDeletePermanentController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await deletePaymentMethodPhysical(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_PAYMENT_METHOD_PURGED',
		message: 'SUCCESS_PAYMENT_METHOD_PURGED',
		ns: 'payments',
		data,
	});
});
