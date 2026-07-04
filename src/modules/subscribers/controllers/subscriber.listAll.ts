import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { listAllSubscribers } from '../application/listAllSubscribers';

export const subscriberListAll = asyncHandler(async (req, res) => {
	const limit = Number(req.query.limit) || 10;
	const page = Number(req.query.page) || 1;
	const status = req.query.status as string | undefined;
	const search = req.query.search as string | undefined;

	const { data, meta } = await listAllSubscribers({ limit, page, status, search });
	successResponse(res, {
		statusCode: 200,
		message: 'SUCCESS_SUBSCRIBER_LIST',
		ns: 'subscribers',
		code: 'SUCCESS_SUBSCRIBER_LIST',
		data,
		meta,
	});
});
