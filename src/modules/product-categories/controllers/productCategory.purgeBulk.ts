import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { bulkOutcome } from '@Helpers/bulkOutcome';
import { BulkIdsSchema } from '@Shared/schemas/bulkIds.schema';
import { purgeProductCategoriesBulk } from '../application/purgeProductCategoriesBulk';

export const purgeProductCategoriesBulkController = asyncHandler(
	async (req, res) => {
		const validated = validate(BulkIdsSchema, req.body);

		const data = await purgeProductCategoriesBulk(validated.ids);

		const code = `PRODUCT_CATEGORIES_BULK_PURGE_${bulkOutcome(data)}`;

		successResponse(res, {
			statusCode: 200,
			code,
			message: code,
			ns: 'product-categories',
			data,
		});
	},
);
