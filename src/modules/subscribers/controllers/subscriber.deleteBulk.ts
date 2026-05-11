import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import setThrowError from '@Helpers/setThrowError';
import { BulkDeleteSubscriberSchema } from '../schemas/subscriberBulkDeleteSubscriberSchema';
import { deleteSubscribersBulk } from '../application/deleteSubscribersBulk';

export const subscriberDeletePhysicalBulk = asyncHandler(async (req, res) => {
	const parsed = BulkDeleteSubscriberSchema.safeParse(req.body);

	if (!parsed.success) {
		setThrowError({
			statusCode: 422,
			message: parsed.error.issues.map((i) => i.message).join(', '),
			code: 'ERROR_INVALID_BODY',
		});
	}

	const data = await deleteSubscribersBulk(parsed.data.ids);

	let code: string;
	if (data.deletedIds.length === 0) {
		code = 'SUCCESS_NO_SUBSCRIBERS_DELETED';
	} else if (data.notFoundIds.length > 0) {
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
