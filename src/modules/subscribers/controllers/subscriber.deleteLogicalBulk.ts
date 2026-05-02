import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import setThrowError from '@Helpers/setThrowError';
import { BulkDeleteSubscriberSchema } from '../schemas/subscriberBulkDeleteSubscriberSchema';
import { deleteSubscribersLogicalBulk } from '../application/deleteSubscribersLogicalBulk';

export const subscriberDeleteLogicalBulk = asyncHandler(async (req, res) => {
	const parsed = BulkDeleteSubscriberSchema.safeParse(req.body);

	if (!parsed.success) {
		setThrowError({
			statusCode: 422,
			message: parsed.error.issues.map((i) => i.message).join(', '),
			code: 'ERROR_INVALID_BODY',
		});
	}

	const data = await deleteSubscribersLogicalBulk(parsed.data.ids);

	const code = data.deletedIds.length === 0
		? 'SUCCESS_NO_SUBSCRIBERS_DELETED'
		: data.notFoundOrInactiveIds.length > 0
			? 'SUCCESS_SUBSCRIBERS_PARTIALLY_DELETED'
			: 'SUCCESS_SUBSCRIBERS_DELETED';

	const message = data.deletedIds.length === 0
		? 'No subscribers were deleted'
		: data.notFoundOrInactiveIds.length > 0
			? 'Subscribers deleted partially'
			: 'Subscribers deleted successfully';

	successResponse(res, { statusCode: 200, message, code, data });
});
