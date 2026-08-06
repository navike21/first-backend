import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { bulkOutcome } from '@Helpers/bulkOutcome';
import { BulkIdsSchema } from '@Shared/schemas/bulkIds.schema';
import { deleteProductCategoriesBulk } from '../application/deleteProductCategoriesBulk';

export const deleteProductCategoriesBulkController = asyncHandler(
	async (req, res) => {
		const validated = validate(BulkIdsSchema, req.body);

		const data = await deleteProductCategoriesBulk(validated.ids);

		const code = `PRODUCT_CATEGORIES_BULK_SOFT_DELETE_${bulkOutcome(data)}`;

		successResponse(res, {
			statusCode: 200,
			code,
			message: code,
			ns: 'product-categories',
			data,
		});
	},
);
