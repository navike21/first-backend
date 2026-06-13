import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { updateSubscriber } from '../application/updateSubscriber';
import { SubscriberUpdateSchema } from '../schemas/subscriber.updateSchema';

export const subscriberUpdate = asyncHandler(async (req, res) => {
	const input = validate(SubscriberUpdateSchema, req.body);
	const data = await updateSubscriber(String(req.params.id), input);
	successResponse(res, {
		statusCode: 200,
		message: 'SUCCESS_SUBSCRIBER_UPDATE',
		ns: 'subscribers',
		code: 'SUCCESS_SUBSCRIBER_UPDATE',
		data,
	});
});
