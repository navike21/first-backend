import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { deleteSubscriber } from '../application/deleteSubscriber';

export const subscriberDeletePhysical = asyncHandler(async (req, res) => {
	const data = await deleteSubscriber(String(req.params.id));
	successResponse(res, {
		statusCode: 200,
		message: 'Subscriber permanently deleted successfully',
		code: 'SUCCESS_SUBSCRIBER_DELETED_PHYSICAL',
		data,
	});
});
