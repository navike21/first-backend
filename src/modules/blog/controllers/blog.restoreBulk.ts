import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { bulkOutcome } from '@Helpers/bulkOutcome';
import { BulkIdsSchema } from '@Shared/schemas/bulkIds.schema';
import { restoreBlogPostsBulk } from '../application/restoreBlogPostsBulk';

export const restoreBlogPostsBulkController = asyncHandler(async (req, res) => {
	const validated = validate(BulkIdsSchema, req.body);

	const data = await restoreBlogPostsBulk(validated.ids);

	const code = `BLOG_BULK_RESTORE_${bulkOutcome(data)}`;

	successResponse(res, {
		statusCode: 200,
		code,
		message: code,
		ns: 'blog',
		data,
	});
});
