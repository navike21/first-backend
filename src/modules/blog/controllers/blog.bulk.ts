import { asyncHandler } from '@Middlewares/asyncHandler';
import { validate } from '@Helpers/validate';
import { bulkOutcome } from '@Helpers/bulkOutcome';
import { BulkIdsSchema } from '@Shared/schemas/bulkIds.schema';
import {
	deleteBlogPostsBulk,
	restoreBlogPostsBulk,
	purgeBlogPostsBulk,
} from '../application/blogBulkOperations';
import { respondBlog } from './blogResponse';

export const deleteBlogPostsBulkController = asyncHandler(async (req, res) => {
	const validated = validate(BulkIdsSchema, req.body);
	const data = await deleteBlogPostsBulk(validated.ids);
	respondBlog(res, 200, `BLOG_BULK_SOFT_DELETE_${bulkOutcome(data)}`, data);
});

export const restoreBlogPostsBulkController = asyncHandler(async (req, res) => {
	const validated = validate(BulkIdsSchema, req.body);
	const data = await restoreBlogPostsBulk(validated.ids);
	respondBlog(res, 200, `BLOG_BULK_RESTORE_${bulkOutcome(data)}`, data);
});

export const purgeBlogPostsBulkController = asyncHandler(async (req, res) => {
	const validated = validate(BulkIdsSchema, req.body);
	const data = await purgeBlogPostsBulk(validated.ids);
	respondBlog(res, 200, `BLOG_BULK_PURGE_${bulkOutcome(data)}`, data);
});
