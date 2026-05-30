import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { restoreSubscriber } from '../application/restoreSubscriber';

export const subscriberRestoreController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await restoreSubscriber(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_SUBSCRIBER_RESTORED',
		message: 'SUCCESS_SUBSCRIBER_RESTORED',
		ns: 'subscribers',
		data,
	});
});
