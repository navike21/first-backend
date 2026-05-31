import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { AppError } from '@Shared/domain/AppError';
import { BulkIdsSchema } from '@Shared/schemas/bulkIds.schema';
import { purgePortfolioBulk } from '../application/purgePortfolioBulk';

export const purgePortfolioBulkController = asyncHandler(async (req, res) => {
	const parsed = BulkIdsSchema.safeParse(req.body);
	if (!parsed.success) {
		AppError.unprocessable(
			'VALIDATION_SCHEMA_ERROR',
			'Validation failed',
			parsed.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
		);
	}

	const data = await purgePortfolioBulk(parsed.data!.ids);

	const code =
		data.processedIds.length === 0
			? 'PORTFOLIO_BULK_PURGE_NONE'
			: data.notFoundIds.length > 0
				? 'PORTFOLIO_BULK_PURGE_PARTIAL'
				: 'PORTFOLIO_BULK_PURGE_SUCCESS';

	successResponse(res, { statusCode: 200, code, message: code, ns: 'portfolio', data });
});
