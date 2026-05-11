import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { updateSubscriber } from '../application/updateSubscriber';

export const subscriberUpdate = asyncHandler(async (req, res) => {
	const data = await updateSubscriber(String(req.params.id), req.body);
	successResponse(res, {
		statusCode: 200,
		message: 'SUCCESS_SUBSCRIBER_UPDATE',
		ns: 'subscribers',
		code: 'SUCCESS_SUBSCRIBER_UPDATE',
		data,
	});
});
