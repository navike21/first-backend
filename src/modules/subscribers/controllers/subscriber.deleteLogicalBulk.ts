import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { BulkDeleteSubscriberSchema } from '../schemas/subscriberBulkDeleteSubscriberSchema';
import { deleteSubscribersLogicalBulk } from '../application/deleteSubscribersLogicalBulk';

export const subscriberDeleteLogicalBulk = asyncHandler(async (req, res) => {
	const validated = validate(BulkDeleteSubscriberSchema, req.body);

	const data = await deleteSubscribersLogicalBulk(validated.ids);

	let code: string;
	if (data.deletedIds.length === 0) {
		code = 'SUCCESS_NO_SUBSCRIBERS_DELETED';
	} else if (data.notFoundOrInactiveIds.length > 0) {
		code = 'SUCCESS_SUBSCRIBERS_PARTIALLY_DELETED';
	} else {
		code = 'SUCCESS_SUBSCRIBERS_DELETED';
	}

	successResponse(res, {
		statusCode: 200,
		message: code,
		ns: 'subscribers',
		code,
		data,
	});
});
