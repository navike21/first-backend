import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { listDeletedSubscribers } from '../application/listDeletedSubscribers';

export const subscriberTrashController = asyncHandler(async (req, res) => {
	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 20;
	const { data, meta } = await listDeletedSubscribers({ page, limit });
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_SUBSCRIBER_TRASH_LIST',
		message: 'SUCCESS_SUBSCRIBER_TRASH_LIST',
		ns: 'subscribers',
		data,
		meta,
	});
});
