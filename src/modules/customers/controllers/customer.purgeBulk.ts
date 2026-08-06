import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { bulkOutcome } from '@Helpers/bulkOutcome';
import { BulkIdsSchema } from '@Shared/schemas/bulkIds.schema';
import { purgeCustomersBulk } from '../application/purgeCustomersBulk';

export const purgeCustomersBulkController = asyncHandler(async (req, res) => {
	const validated = validate(BulkIdsSchema, req.body);

	const data = await purgeCustomersBulk(validated.ids);

	const code = `CUSTOMERS_BULK_PURGE_${bulkOutcome(data)}`;

	successResponse(res, {
		statusCode: 200,
		code,
		message: code,
		ns: 'customers',
		data,
	});
});
