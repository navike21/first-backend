import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { bulkOutcome } from '@Helpers/bulkOutcome';
import { BulkIdsSchema } from '@Shared/schemas/bulkIds.schema';
import { purgeLocationsBulk } from '../application/purgeLocationsBulk';

export const purgeLocationsBulkController = asyncHandler(async (req, res) => {
	const validated = validate(BulkIdsSchema, req.body);

	const data = await purgeLocationsBulk(validated.ids);

	const code = `LOCATIONS_BULK_PURGE_${bulkOutcome(data)}`;

	successResponse(res, {
		statusCode: 200,
		code,
		message: code,
		ns: 'inventory',
		data,
	});
});
