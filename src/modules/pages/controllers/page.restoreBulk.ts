import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { AppError } from '@Shared/domain/AppError';
import { BulkIdsSchema } from '@Shared/schemas/bulkIds.schema';
import { restorePagesBulk } from '../application/restorePagesBulk';

export const restorePagesBulkController = asyncHandler(async (req, res) => {
	const parsed = BulkIdsSchema.safeParse(req.body);
	if (!parsed.success) {
		AppError.unprocessable(
			'VALIDATION_SCHEMA_ERROR',
			'Validation failed',
			parsed.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
		);
	}

	const data = await restorePagesBulk(parsed.data!.ids);

	const code =
		data.processedIds.length === 0
			? 'PAGES_BULK_RESTORE_NONE'
			: data.notFoundIds.length > 0
				? 'PAGES_BULK_RESTORE_PARTIAL'
				: 'PAGES_BULK_RESTORE_SUCCESS';

	successResponse(res, { statusCode: 200, code, message: code, ns: 'pages', data });
});
