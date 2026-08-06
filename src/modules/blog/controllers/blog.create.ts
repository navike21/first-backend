import { asyncHandler } from '@Middlewares/asyncHandler';
import { validate } from '@Helpers/validate';
import {
	parseRequestData,
	getUploadedFileField,
} from '@Helpers/multipartRequest';
import { createBlogPost } from '../application/createBlogPost';
import { CreateBlogSchema } from '../schemas/blog.schema';
import { respondBlog } from './blogResponse';

export const blogCreateController = asyncHandler(async (req, res) => {
	const validated = validate(CreateBlogSchema, parseRequestData(req));

	const result = await createBlogPost(
		validated,
		{
			cover: getUploadedFileField(req, 'cover'),
			ogImage: getUploadedFileField(req, 'ogImage'),
		},
		res.locals.userId as string | undefined,
	);
	respondBlog(res, 201, 'SUCCESS_BLOG_CREATE', result.data, {
		warnings: result.warnings,
	});
});
