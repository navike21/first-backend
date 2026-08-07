import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { updatePaymentMethod } from '../application/updatePaymentMethod';
import { UpdatePaymentMethodSchema } from '../schemas/paymentMethod.schema';

export const paymentMethodUpdateController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const validated = validate(UpdatePaymentMethodSchema, req.body);

	const data = await updatePaymentMethod(id, validated);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_PAYMENT_METHOD_UPDATE',
		message: 'SUCCESS_PAYMENT_METHOD_UPDATE',
		ns: 'payments',
		data,
	});
});
