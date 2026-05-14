import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { AppError } from '@Shared/domain/AppError';
import { registerSubscriberBulk } from '../application/registerSubscriberBulk';

export const subscriberRegisterBulk = asyncHandler(async (req, res) => {
	if (!Array.isArray(req.body) || req.body.length === 0) {
		AppError.badRequest('ERROR_NO_SUBSCRIBERS_PROVIDED', 'No subscribers provided for bulk registration');
	}

	const data = await registerSubscriberBulk(req.body);
	successResponse(res, {
		statusCode: 201,
		message: 'SUCCESS_SUBSCRIBERS_REGISTER_BULK',
		ns: 'subscribers',
		code: 'SUCCESS_SUBSCRIBERS_REGISTER_BULK',
		data,
	});
});
