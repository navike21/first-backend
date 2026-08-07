import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { bulkOutcome } from '@Helpers/bulkOutcome';
import { BulkIdsSchema } from '@Shared/schemas/bulkIds.schema';
import { restoreCouponsBulk } from '../application/restoreCouponsBulk';

export const restoreCouponsBulkController = asyncHandler(async (req, res) => {
	const validated = validate(BulkIdsSchema, req.body);

	const data = await restoreCouponsBulk(validated.ids);

	const code = `COUPONS_BULK_RESTORE_${bulkOutcome(data)}`;

	successResponse(res, {
		statusCode: 200,
		code,
		message: code,
		ns: 'coupons',
		data,
	});
});
