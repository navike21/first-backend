import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { createPaymentMethod } from '../application/createPaymentMethod';
import { CreatePaymentMethodSchema } from '../schemas/paymentMethod.schema';

export const paymentMethodCreateController = asyncHandler(async (req, res) => {
	const validated = validate(CreatePaymentMethodSchema, req.body);

	const data = await createPaymentMethod(validated);
	successResponse(res, {
		statusCode: 201,
		code: 'SUCCESS_PAYMENT_METHOD_CREATE',
		message: 'SUCCESS_PAYMENT_METHOD_CREATE',
		ns: 'payments',
		data,
	});
});
