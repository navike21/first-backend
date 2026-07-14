import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { bulkOutcome } from '@Helpers/bulkOutcome';
import { BulkIdsSchema } from '@Shared/schemas/bulkIds.schema';
import { restoreSubscribersBulk } from '../application/restoreSubscribersBulk';

export const subscriberRestoreBulkController = asyncHandler(
	async (req, res) => {
		const validated = validate(BulkIdsSchema, req.body);

		const data = await restoreSubscribersBulk(validated.ids);

		const code = `SUBSCRIBERS_BULK_RESTORE_${bulkOutcome(data)}`;

		successResponse(res, {
			statusCode: 200,
			code,
			message: code,
			ns: 'subscribers',
			data,
		});
	},
);
