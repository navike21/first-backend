import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { bulkOutcome } from '@Helpers/bulkOutcome';
import { BulkIdsSchema } from '@Shared/schemas/bulkIds.schema';
import { restoreCategoriesBulk } from '../application/restoreCategoriesBulk';

export const restoreCategoriesBulkController = asyncHandler(
	async (req, res) => {
		const validated = validate(BulkIdsSchema, req.body);

		const data = await restoreCategoriesBulk(validated.ids);

		const code = `CATEGORIES_BULK_RESTORE_${bulkOutcome(data)}`;

		successResponse(res, {
			statusCode: 200,
			code,
			message: code,
			ns: 'categories',
			data,
		});
	},
);
