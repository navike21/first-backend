import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { deleteSubscriberLogical } from '../application/deleteSubscriberLogical';

export const subscriberDeleteLogical = asyncHandler(async (req, res) => {
	const data = await deleteSubscriberLogical(String(req.params.id));
	successResponse(res, {
		statusCode: 200,
		message: 'SUCCESS_SUBSCRIBER_DELETED',
		ns: 'subscribers',
		code: 'SUCCESS_SUBSCRIBER_DELETED',
		data,
	});
});
