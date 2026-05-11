import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { searchSubscriberById } from '../application/searchSubscriberById';

export const subscriberSearchById = asyncHandler(async (req, res) => {
	const data = await searchSubscriberById(String(req.params.id));
	successResponse(res, {
		statusCode: 200,
		message: 'SUCCESS_SUBSCRIBER_FOUND',
		ns: 'subscribers',
		code: 'SUCCESS_SUBSCRIBER_FOUND',
		data,
	});
});
