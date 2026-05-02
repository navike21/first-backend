import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { registerSubscriber } from '../application/registerSubscriber';

export const subscriberRegister = asyncHandler(async (req, res) => {
	const data = await registerSubscriber(req.body);
	successResponse(res, {
		statusCode: 201,
		message: 'SUCCESS_SUBSCRIBER_REGISTER',
		ns: 'subscribers',
		code: 'SUCCESS_SUBSCRIBER_REGISTER',
		data,
	});
});
