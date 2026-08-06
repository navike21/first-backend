import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { bulkOutcome } from '@Helpers/bulkOutcome';
import { BulkIdsSchema } from '@Shared/schemas/bulkIds.schema';
import {
	deleteBlogPostsBulk,
	restoreBlogPostsBulk,
	purgeBlogPostsBulk,
} from '../application/blogBulkOperations';

export const deleteBlogPostsBulkController = asyncHandler(async (req, res) => {
	const validated = validate(BulkIdsSchema, req.body);
	const data = await deleteBlogPostsBulk(validated.ids);
	const code = `BLOG_BULK_SOFT_DELETE_${bulkOutcome(data)}`;
	successResponse(res, { statusCode: 200, code, message: code, ns: 'blog', data });
});

export const restoreBlogPostsBulkController = asyncHandler(async (req, res) => {
	const validated = validate(BulkIdsSchema, req.body);
	const data = await restoreBlogPostsBulk(validated.ids);
	const code = `BLOG_BULK_RESTORE_${bulkOutcome(data)}`;
	successResponse(res, { statusCode: 200, code, message: code, ns: 'blog', data });
});

export const purgeBlogPostsBulkController = asyncHandler(async (req, res) => {
	const validated = validate(BulkIdsSchema, req.body);
	const data = await purgeBlogPostsBulk(validated.ids);
	const code = `BLOG_BULK_PURGE_${bulkOutcome(data)}`;
	successResponse(res, { statusCode: 200, code, message: code, ns: 'blog', data });
});
