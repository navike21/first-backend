import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import {
	parseRequestData,
	getUploadedFileField,
} from '@Helpers/multipartRequest';
import { createBlogPost } from '../application/createBlogPost';
import { CreateBlogSchema } from '../schemas/blog.schema';

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
	successResponse(res, {
		statusCode: 201,
		code: 'SUCCESS_BLOG_CREATE',
		message: 'SUCCESS_BLOG_CREATE',
		ns: 'blog',
		data: result.data,
		warnings: result.warnings,
	});
});
