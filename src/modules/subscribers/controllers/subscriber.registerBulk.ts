import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import setThrowError from '@Helpers/setThrowError';
import { registerSubscriberBulk } from '../application/registerSubscriberBulk';

export const subscriberRegisterBulk = asyncHandler(async (req, res) => {
	if (!Array.isArray(req.body) || req.body.length === 0) {
		setThrowError({
			statusCode: 400,
			message: 'No subscribers provided for bulk registration',
			code: 'ERROR_NO_SUBSCRIBERS_PROVIDED',
		});
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
