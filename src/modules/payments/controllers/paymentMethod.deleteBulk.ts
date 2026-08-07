import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { bulkOutcome } from '@Helpers/bulkOutcome';
import { BulkIdsSchema } from '@Shared/schemas/bulkIds.schema';
import { deletePaymentMethodsBulk } from '../application/deletePaymentMethodsBulk';

export const deletePaymentMethodsBulkController = asyncHandler(async (req, res) => {
	const validated = validate(BulkIdsSchema, req.body);

	const data = await deletePaymentMethodsBulk(validated.ids);

	const code = `PAYMENT_METHODS_BULK_SOFT_DELETE_${bulkOutcome(data)}`;

	successResponse(res, {
		statusCode: 200,
		code,
		message: code,
		ns: 'payments',
		data,
	});
});
