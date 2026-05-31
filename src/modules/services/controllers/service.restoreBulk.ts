import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { AppError } from '@Shared/domain/AppError';
import { BulkIdsSchema } from '@Shared/schemas/bulkIds.schema';
import { restoreServicesBulk } from '../application/restoreServicesBulk';

export const restoreServicesBulkController = asyncHandler(async (req, res) => {
	const parsed = BulkIdsSchema.safeParse(req.body);
	if (!parsed.success) {
		AppError.unprocessable(
			'VALIDATION_SCHEMA_ERROR',
			'Validation failed',
			parsed.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
		);
	}

	const data = await restoreServicesBulk(parsed.data!.ids);

	const code =
		data.processedIds.length === 0
			? 'SERVICES_BULK_RESTORE_NONE'
			: data.notFoundIds.length > 0
				? 'SERVICES_BULK_RESTORE_PARTIAL'
				: 'SERVICES_BULK_RESTORE_SUCCESS';

	successResponse(res, { statusCode: 200, code, message: code, ns: 'services', data });
});
