import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { listAllSubscribers } from '../application/listAllSubscribers';
import { ListSubscribersQuerySchema } from '../schemas/subscriber.schema';

export const subscriberListAll = asyncHandler(async (req, res) => {
	const query = ListSubscribersQuerySchema.parse(req.query);

	const { data, meta } = await listAllSubscribers(query);
	successResponse(res, {
		statusCode: 200,
		message: 'SUCCESS_SUBSCRIBER_LIST',
		ns: 'subscribers',
		code: 'SUCCESS_SUBSCRIBER_LIST',
		data,
		meta,
	});
});
