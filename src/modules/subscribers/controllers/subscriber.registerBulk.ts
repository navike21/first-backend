import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validateArray } from '@Helpers/validate';
import { AppError } from '@Shared/domain/AppError';
import { registerSubscriberBulk } from '../application/registerSubscriberBulk';
import { SubscriberRegisterSchema } from '../schemas/subscriber.schema';

export const subscriberRegisterBulk = asyncHandler(async (req, res) => {
	if (!Array.isArray(req.body) || req.body.length === 0) {
		AppError.badRequest(
			'ERROR_NO_SUBSCRIBERS_PROVIDED',
			'No subscribers provided for bulk registration',
		);
	}

	const input = validateArray(SubscriberRegisterSchema, req.body);
	const data = await registerSubscriberBulk(input);
	successResponse(res, {
		statusCode: 201,
		message: 'SUCCESS_SUBSCRIBERS_REGISTER_BULK',
		ns: 'subscribers',
		code: 'SUCCESS_SUBSCRIBERS_REGISTER_BULK',
		data,
	});
});
