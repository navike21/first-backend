import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { registerSubscriber } from '../application/registerSubscriber';
import { SubscriberRegisterSchema } from '../schemas/subscriber.schema';

export const subscriberRegister = asyncHandler(async (req, res) => {
	const input = validate(SubscriberRegisterSchema, req.body);
	const data = await registerSubscriber(input);
	successResponse(res, {
		statusCode: 201,
		message: 'SUCCESS_SUBSCRIBER_REGISTER',
		ns: 'subscribers',
		code: 'SUCCESS_SUBSCRIBER_REGISTER',
		data,
	});
});
